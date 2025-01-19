import crypto from "crypto";
import qs from "qs";
import moment from "moment";
import { vnpayConfig } from "../../config/vnpay.js";
import { PaymentService } from "../../services/payment.service.js";

const paymentService = new PaymentService();

function sortObject(o) {
  const obj = { ...o };

  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export const createPayment = async (ctx) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();

    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("DDHHmmss");

    const ipAddr =
      ctx.request.ip ||
      ctx.request.connection?.remoteAddress ||
      ctx.socket?.remoteAddress;

    const amount = 200000; // 200,000 VND
    const orderInfo = "Thanh toan cho ma GD:" + orderId;
    const locale = "vn";

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnpayConfig.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    await paymentService.createOrder({
      userId: ctx.state.user.id,
      orderId,
      amount,
      status: "pending",
    });

    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpParams["vnp_SecureHash"] = signed;
    const paymentUrl =
      vnpayConfig.url + "?" + qs.stringify(vnpParams, { encode: false });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        paymentUrl,
        orderId,
      },
    };
  } catch (error) {
    console.error("Payment creation error:", error);
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

export const vnpayIPN = async (ctx) => {
  try {
    const vnpParams = ctx.query;
    const secureHash = vnpParams["vnp_SecureHash"];

    const orderId = vnpParams["vnp_TxnRef"];
    const rspCode = vnpParams["vnp_ResponseCode"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const order = await paymentService.getOrder(orderId);

      if (!order) {
        ctx.status = 200;
        ctx.body = { RspCode: "01", Message: "Order not found" };
        return;
      }

      if (order.amount * 100 !== parseInt(vnpParams["vnp_Amount"])) {
        ctx.status = 200;
        ctx.body = { RspCode: "04", Message: "Amount invalid" };
        return;
      }

      if (order.status !== "pending") {
        ctx.status = 200;
        ctx.body = { RspCode: "02", Message: "Order already processed" };
        return;
      }

      if (rspCode === "00") {
        await paymentService.handleSuccessfulPayment(orderId);
      } else {
        await paymentService.handleFailedPayment(orderId);
      }

      ctx.status = 200;
      ctx.body = { RspCode: "00", Message: "Success" };
    } else {
      ctx.status = 200;
      ctx.body = { RspCode: "97", Message: "Checksum failed" };
    }
  } catch (error) {
    console.error("IPN Error:", error);
    ctx.status = 200;
    ctx.body = { RspCode: "99", Message: "Internal error" };
  }
};

export const vnpayReturn = async (ctx) => {
  try {
    console.log("Return URL called with params:", ctx.query);

    const vnpParams = { ...ctx.query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const frontendUrl = new URL(vnpayConfig.frontendCallbackUrl);

    if (secureHash === signed) {
      if (
        vnpParams["vnp_ResponseCode"] === "00" &&
        vnpParams["vnp_TransactionStatus"] === "00"
      ) {
        try {
          const order = await paymentService.getOrder(vnpParams["vnp_TxnRef"]);
          if (order) {
            await paymentService.updateOrder(order.id, {
              status: "completed",
              paymentDate: vnpParams["vnp_PayDate"],
              transactionNo: vnpParams["vnp_TransactionNo"],
            });

            await paymentService.createLicense(order.userId);

            console.log("Payment processed and license created:", {
              orderId: vnpParams["vnp_TxnRef"],
              userId: order.userId,
            });
          }
        } catch (error) {
          console.error("License creation error:", error);
        }
      }

      frontendUrl.searchParams.append("status", "success");
      frontendUrl.searchParams.append("code", vnpParams["vnp_ResponseCode"]);
      frontendUrl.searchParams.append("orderId", vnpParams["vnp_TxnRef"]);
    } else {
      frontendUrl.searchParams.append("status", "error");
      frontendUrl.searchParams.append("code", "97");
      frontendUrl.searchParams.append("message", "Invalid signature");
    }

    ctx.redirect(frontendUrl.toString());
  } catch (error) {
    console.error("Return URL Error:", error);
    const frontendUrl = new URL(vnpayConfig.frontendCallbackUrl);
    frontendUrl.searchParams.append("status", "error");
    frontendUrl.searchParams.append("code", "99");
    frontendUrl.searchParams.append("message", "Internal server error");
    ctx.redirect(frontendUrl.toString());
  }
};

import { config } from "dotenv";

config();

export const vnpayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE,
  hashSecret: process.env.VNPAY_HASH_SECRET,
  url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: `${process.env.BACKEND_URL}/api/v1/payment/vnpay-return`,
  ipnUrl: `${process.env.BACKEND_URL}/api/v1/payment/vnpay-ipn`,
  frontendCallbackUrl: `${process.env.FRONTEND_URL}/payment/status`,
};

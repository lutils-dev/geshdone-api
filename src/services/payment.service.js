import { LicenseService } from "./license.service.js";
import { OrderRepository } from "../repositories/order.repository.js";

export class PaymentService {
  constructor() {
    this.licenseService = new LicenseService();
    this.orderRepository = new OrderRepository();
  }

  async createOrder(orderData) {
    try {
      const order = await this.orderRepository.create(orderData);
      console.log("Order created:", order);
      return order;
    } catch (error) {
      console.error("Order creation error:", error);
      throw new Error("Failed to create order");
    }
  }

  async getOrder(orderId) {
    return this.orderRepository.findByOrderId(orderId);
  }

  async updateOrder(id, data) {
    return this.orderRepository.update(id, data);
  }

  async cleanupPendingOrders(userId) {
    try {
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

      await this.orderRepository.update(
        {
          userId,
          status: "pending",
          createdAt: Less(thirtyMinutesAgo),
        },
        {
          status: "expired",
        }
      );
    } catch (error) {
      console.error("Cleanup pending orders error:", error);
    }
  }

  async createLicense(userId) {
    try {
      const existingLicense = await this.licenseService.getUserLicense(userId);
      if (existingLicense) {
        console.log("User already has a license:", userId);
        return existingLicense;
      }

      const license = await this.licenseService.createLicense(userId);
      console.log("License created:", {
        userId,
        licenseId: license.id,
      });
      return license;
    } catch (error) {
      console.error("License creation error:", error);
      throw error;
    }
  }
}

import { AppDataSource } from "../config/database.js";
import { Order } from "../entities/order.entity.js";

export class OrderRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  async create(orderData) {
    const order = this.repository.create(orderData);
    return this.repository.save(order);
  }

  async findOne(options) {
    return this.repository.findOne(options);
  }

  async update(id, data) {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async findByOrderId(orderId) {
    return this.repository.findOne({
      where: { orderId },
      relations: ["user"],
    });
  }
}

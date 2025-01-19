import { AppDataSource } from "../config/database.js";
import { License } from "../entities/license.entity.js";

export class LicenseRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(License);
  }

  async findByUserId(userId) {
    return this.repository.findOne({
      where: { userId }
    });
  }

  async create(data) {
    const license = this.repository.create(data);
    return this.repository.save(license);
  }
}

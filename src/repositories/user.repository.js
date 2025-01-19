import { AppDataSource } from "../config/database.js";
import { User } from "../entities/user.entity.js";

export class UserRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(userData) {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async findByEmail(email) {
    try {
      return await this.repository.findOne({
        where: { email },
      });
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  async findById(id) {
    try {
      return await this.repository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error("Error finding user by id:", error);
      return null;
    }
  }
}

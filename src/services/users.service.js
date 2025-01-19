import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData) {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userRepository.create(userData);
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    return user;
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(id, updates) {
    const user = await this.getUserById(id);

    const allowedUpdates = {
      name: updates.name,
      preferredModel: updates.preferredModel,
    };

    Object.assign(user, allowedUpdates);
    return this.userRepository.save(user);
  }
}

import { AppDataSource } from "../config/database.js";
import { Board } from "../entities/board.entity.js";

export class BoardRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(Board);
  }

  async create(boardData) {
    const board = this.repository.create(boardData);
    return this.repository.save(board);
  }

  async findById(id, relations = []) {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByUserId(userId) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async find(options) {
    return this.repository.find(options);
  }

  async count(options) {
    return this.repository.count(options);
  }

  async findOne(options) {
    return this.repository.findOne(options);
  }

  async save(board) {
    return this.repository.save(board);
  }
}

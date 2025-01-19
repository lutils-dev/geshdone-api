import { AppDataSource } from "../config/database.js";
import { BoardElement } from "../entities/boardElement.entity.js";

export class BoardElementRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(BoardElement);
  }

  async create(elementData) {
    const element = this.repository.create(elementData);
    return this.repository.save(element);
  }

  async createMany(elementsData) {
    const elements = this.repository.create(elementsData);
    return this.repository.save(elements);
  }

  async findByBoardId(boardId) {
    return this.repository.find({
      where: { boardId },
      order: { zIndex: "ASC" },
    });
  }
}

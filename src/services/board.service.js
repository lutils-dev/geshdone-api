import { ModelFactory } from "../lib/llm/models/model.factory.js";
import { VisionBoardAnalyzeChain } from "../chains/vision-board/analyze.chain.js";
import { VisionBoardLayoutChain } from "../chains/vision-board/layout.chain.js";
import { BoardRepository } from "../repositories/board.repository.js";
import { BoardElementRepository } from "../repositories/boardElement.repository.js";
import { UserService } from "./users.service.js";
import { searchImages } from "../utils/image.util.js";

export class BoardService {
  constructor() {
    this.boardRepository = new BoardRepository();
    this.elementRepository = new BoardElementRepository();
    this.userService = new UserService();
  }

  async createBoard(userId, prompt) {
    try {
      const user = await this.userService.getUserById(userId);
      const model = ModelFactory.createModel(user.preferredModel);

      const analyzeChain = new VisionBoardAnalyzeChain(model);
      const layoutChain = new VisionBoardLayoutChain(model);

      const analysis = await analyzeChain.run({
        prompt,
        userId,
      });
      console.log("Analysis result:", analysis);

      const layout = await layoutChain.run({
        analysis,
      });

      const imageSearchPromises = layout.elements
        .filter((element) => element.type === "image")
        .map(async (element) => {
          const images = await searchImages(element.imageKeywords[0], {
            limit: 5,
          });
          return {
            elementId: element.id,
            images,
          };
        });

      const imageSearchResults = await Promise.all(imageSearchPromises);

      const board = await this.boardRepository.create({
        userId,
        title: analysis.mainGoal,
        originalPrompt: prompt,
        canvasSize: layout.canvasSize,
        theme: layout.theme,
        aiAnalysis: analysis,
      });

      const elements = await this.elementRepository.createMany(
        layout.elements.map((element) => {
          let elementData = {
            boardId: board.id,
            type: element.type,
            position: element.position,
            size: element.size,
            rotation: element.rotation || 0,
            style: element.style,
            zIndex: element.zIndex,
          };

          if (element.type === "text") {
            elementData.content = element.content;
          } else if (element.type === "image") {
            const searchResult = imageSearchResults.find(
              (result) => result.elementId === element.id
            );
            elementData.imageData = {
              suggestions: searchResult.images,
              selectedImage: searchResult.images[0],
            };
          }

          return elementData;
        })
      );

      return {
        ...board,
        elements,
      };
    } catch (error) {
      console.error("Board creation error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to create vision board: ${error.message}`);
    }
  }

  async getBoard(id, userId) {
    const board = await this.boardRepository.findById(id);

    if (!board) {
      throw new Error("Board not found");
    }

    if (board.userId !== userId) {
      throw new Error("Unauthorized access to board");
    }

    const elements = await this.elementRepository.findByBoardId(id);

    return {
      ...board,
      elements,
    };
  }

  async getUserBoards(userId, options = {}) {
    const { page = 1, limit = 10, includeArchived = false } = options;

    const boards = await this.boardRepository.findByUserId(userId, {
      page,
      limit,
      includeArchived,
    });

    return boards;
  }

  async updateBoardElement(boardId, elementId, userId, updates) {
    const board = await this.boardRepository.findById(boardId);
    if (!board || board.userId !== userId) {
      throw new Error("Unauthorized access to board");
    }

    const element = await this.elementRepository.update(elementId, updates);

    return element;
  }

  async updateImageSelection(boardId, elementId, userId, imageUrl) {
    const element = await this.elementRepository.findById(elementId);

    if (!element || element.type !== "image") {
      throw new Error("Invalid element");
    }

    const board = await this.boardRepository.findById(boardId);
    if (!board || board.userId !== userId) {
      throw new Error("Unauthorized access to board");
    }

    const updatedElement = await this.elementRepository.update(elementId, {
      imageData: {
        ...element.imageData,
        selectedImage: imageUrl,
      },
    });

    return updatedElement;
  }

  async duplicateBoard(id, userId) {
    const originalBoard = await this.getBoard(id, userId);

    if (!originalBoard) {
      throw new Error("Board not found");
    }

    const newBoard = await this.boardRepository.create({
      ...originalBoard,
      id: undefined,
      userId,
      title: `${originalBoard.title} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
    });

    const newElements = await this.elementRepository.createMany(
      originalBoard.elements.map((element) => ({
        ...element,
        id: undefined,
        boardId: newBoard.id,
        createdAt: undefined,
      }))
    );

    return {
      ...newBoard,
      elements: newElements,
    };
  }

  async exportBoard(id, userId, format = "json") {
    const board = await this.getBoard(id, userId);

    if (!board) {
      throw new Error("Board not found");
    }

    switch (format) {
      case "json":
        return board;
      case "image":
        throw new Error("Image export not implemented");
      default:
        throw new Error("Unsupported export format");
    }
  }

  async findBoards(query, options) {
    try {
      const { page = 1, limit = 12 } = options;
      const offset = (page - 1) * limit;

      const [boards, total] = await Promise.all([
        this.boardRepository.find({
          where: query,
          order: {
            createdAt: "DESC",
          },
          take: limit,
          skip: offset,
          relations: ["elements"],
        }),
        this.boardRepository.count({
          where: query,
        }),
      ]);

      return {
        rows: boards,
        count: total,
      };
    } catch (error) {
      console.error("Error finding boards:", error);
      throw new Error("Failed to fetch boards");
    }
  }

  async archiveBoard(id, userId) {
    const board = await this.boardRepository.findOne({
      where: { id, userId },
    });

    if (!board) {
      const error = new Error("Board not found");
      error.status = 404;
      throw error;
    }

    board.isArchived = true;
    return this.boardRepository.save(board);
  }
}

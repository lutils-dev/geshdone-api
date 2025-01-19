import { BoardService } from "../../services/board.service.js";

const boardService = new BoardService();

export const createBoard = async (ctx) => {
  try {
    console.log("Create Board - Starting");
    console.log("Create Board - User:", ctx.state.user);
    console.log("Create Board - Request Body:", ctx.request.body);

    const { prompt } = ctx.request.body;

    if (!prompt) {
      ctx.status = 400;
      ctx.body = { success: false, message: "Prompt is required" };
      return;
    }

    const board = await boardService.createBoard(ctx.state.user.id, prompt);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: board,
    };
  } catch (error) {
    console.error("Create Board - Error:", error);
    ctx.status = error.status || 400;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

export const getBoard = async (ctx) => {
  try {
    const { id } = ctx.params;
    const board = await boardService.getBoard(id, ctx.state.user.id);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: board,
    };
  } catch (error) {
    ctx.status = error.status || 404;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

export const getUserBoards = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { page = 1, limit = 12, search } = ctx.query;

    const query = {
      userId,
      isArchived: false,
      ...(search
        ? {
            title: {
              $ilike: `%${search}%`,
            },
          }
        : {}),
    };

    const boards = await boardService.findBoards(query, {
      page: parseInt(page),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        boards: boards.rows,
        total: boards.count,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

export const archiveBoard = async (ctx) => {
  try {
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    const board = await boardService.archiveBoard(id, userId);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: board,
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

import Router from "@koa/router";
import {
  createBoard,
  getBoard,
  getUserBoards,
  archiveBoard,
} from "../../controllers/v1/boards.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = new Router({ prefix: "/api/v1/boards" });

router.use(authMiddleware);

router.post("/", createBoard);
router.get("/:id", getBoard);
router.get("/", getUserBoards);
router.post("/:id/archive", archiveBoard);

export default router;

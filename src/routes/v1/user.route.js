import Router from "@koa/router";
import * as userController from "../../controllers/v1/user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = new Router({ prefix: "/api/v1/user" });

router.use(authMiddleware);

router.get("/", userController.getCurrentUser);
router.patch("/", userController.updateUser);

export default router;

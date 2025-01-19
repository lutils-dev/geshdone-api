import Router from "@koa/router";
import * as searchController from "../../controllers/v1/search.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = new Router({ prefix: "/api/v1/search" });

router.use(authMiddleware);

router.get("/images", searchController.searchImages);
router.get("/images/details", searchController.getImageDetails);

export default router;

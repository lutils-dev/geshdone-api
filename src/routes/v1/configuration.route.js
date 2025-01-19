import Router from "@koa/router";
import * as configController from "../../controllers/v1/configuration.controller.js";

const router = new Router({ prefix: "/api/v1/configuration" });

router.get("/models", configController.getModelConfigurations);

export default router;

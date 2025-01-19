import Router from "@koa/router";
import passport from "../../config/passport.js";
import * as authController from "../../controllers/v1/auth.controller.js";

const router = new Router({ prefix: "/api/v1/auth" });

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.handleGoogleCallback
);

router.post("/logout", authController.logout);

export default router;

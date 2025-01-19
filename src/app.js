import Koa from "koa";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "./config/passport.js";
import cors from "@koa/cors";
import { requestLogger } from "./middleware/logger.middleware.js";
import userRoutes from "./routes/v1/user.route.js";
import authRoutes from "./routes/v1/auth.route.js";
import boardRoutes from "./routes/v1/boards.route.js";
import searchRoutes from "./routes/v1/search.route.js";
import licenseRoutes from "./routes/v1/license.route.js";
import paymentRoutes from "./routes/v1/payment.route.js";
import configurationRoutes from "./routes/v1/configuration.route.js";

const app = new Koa();

app.use(requestLogger);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["set-cookie"],
  })
);

app.use(bodyParser());

app.keys = [process.env.SESSION_SECRET];
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Global Error:", {
      message: err.message,
      stack: err.stack,
    });
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    };
  }
});

app.use(userRoutes.routes());
app.use(authRoutes.routes());
app.use(boardRoutes.routes());
app.use(searchRoutes.routes());
app.use(licenseRoutes.routes());
app.use(paymentRoutes.routes());
app.use(configurationRoutes.routes());

app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: `Route ${ctx.method} ${ctx.url} not found`,
  };
});

export default app;

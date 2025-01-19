import Koa from "koa";
import bodyParser from "koa-bodyparser";
import userRoutes from "./routes/v1/users.route.js";

const app = new Koa();

// Middleware
app.use(bodyParser());

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || "Internal Server Error",
    };
  }
});

// Routes
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

export default app;

import { verifyToken } from "../utils/auth.util.js";

export const authMiddleware = async (ctx, next) => {
  try {
    console.log("Auth Middleware - Starting");

    const token = ctx.cookies.get("auth_token");

    if (!token) {
      console.log("Auth Middleware - No token in cookies");
      ctx.status = 401;
      ctx.body = { success: false, message: "Authentication required" };
      return;
    }

    console.log("Auth Middleware - Token:", token.substring(0, 20) + "...");

    const decoded = verifyToken(token);
    console.log("Auth Middleware - Decoded:", decoded);

    if (!decoded) {
      console.log("Auth Middleware - Invalid token");
      ctx.status = 401;
      ctx.body = { success: false, message: "Invalid token" };
      return;
    }

    ctx.user = decoded;
    ctx.state.user = decoded;

    console.log("Auth Middleware - User set:", {
      id: decoded.id,
      email: decoded.email,
    });

    await next();
  } catch (error) {
    console.error("Auth Middleware - Error:", {
      message: error.message,
      stack: error.stack,
    });
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Authentication failed",
      error: error.message,
    };
  }
};

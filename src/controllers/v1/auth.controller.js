import { generateToken } from "../../utils/auth.util.js";

export const handleGoogleCallback = async (ctx) => {
  try {
    const token = generateToken(ctx.state.user);

    ctx.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const frontendURL = process.env.FRONTEND_URL;
    ctx.redirect(`${frontendURL}/auth/callback?success=true`);
  } catch (error) {
    console.error("Google callback error:", error);
    ctx.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

export const logout = async (ctx) => {
  ctx.cookies.set("auth_token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  ctx.body = {
    success: true,
    message: "Logged out successfully",
  };
};

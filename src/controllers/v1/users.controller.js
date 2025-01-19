import { UserService } from "../../services/users.service.js";
import { validateUser } from "../../utils/validation.util.js";

const userService = new UserService();

export const createUser = async (ctx) => {
  try {
    const userData = ctx.request.body;
    const validationErrors = validateUser(userData);

    if (validationErrors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        errors: validationErrors,
      };
      return;
    }

    const user = await userService.createUser(userData);
    ctx.status = 201;
    ctx.body = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    ctx.status = error.status || 400;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

export const getUser = async (ctx) => {
  try {
    const user = await userService.getUserById(ctx.params.id);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    ctx.status = error.status || 404;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

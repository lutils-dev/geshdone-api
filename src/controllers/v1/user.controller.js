import { UserService } from '../../services/users.service.js';

const userService = new UserService();

export const getCurrentUser = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const user = await userService.getUserById(userId);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredModel: user.preferredModel,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
};

export const updateUser = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const updates = ctx.request.body;

    const user = await userService.updateUser(userId, updates);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredModel: user.preferredModel,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
};

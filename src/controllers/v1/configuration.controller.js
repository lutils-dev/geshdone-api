import { ConfigurationService } from "../../services/configuration.service.js";

const configService = new ConfigurationService();

export const getModelConfigurations = async (ctx) => {
  try {
    const models = await configService.getModelConfigurations();
    ctx.body = {
      success: true,
      data: models,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

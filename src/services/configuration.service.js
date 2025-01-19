import { AppDataSource } from "../config/database.js";
import { Configuration } from "../entities/configuration.entity.js";

export class ConfigurationService {
  constructor() {
    this.repository = AppDataSource.getRepository(Configuration);
  }

  async getModelConfigurations() {
    const config = await this.repository.findOne({
      where: { key: "available_models" },
    });

    if (!config) {
      return [
        {
          id: "openai",
          name: "OpenAI GPT-4o",
          description: "Balanced performance and cost",
          isAvailable: true,
          requiresApiKey: false,
        },
        {
          id: "anthropic",
          name: "Anthropic Claude",
          description: "Advanced reasoning and analysis",
          isAvailable: true,
          requiresApiKey: false,
        },
        {
          id: "gemini",
          name: "Google Gemini Pro",
          description: "Google's latest AI model",
          isAvailable: true,
          requiresApiKey: false,
        },
      ];
    }

    return config.value;
  }
  async updateModelConfigurations(models) {
    let config = await this.repository.findOne({
      where: { key: "available_models" },
    });

    if (!config) {
      config = this.repository.create({
        key: "available_models",
        value: models,
      });
    } else {
      config.value = models;
    }

    return this.repository.save(config);
  }
}

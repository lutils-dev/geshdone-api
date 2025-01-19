import { OpenAIModel } from "./openai.model.js";
import { AnthropicModel } from "./anthropic.model.js";
import { GeminiModel } from "./gemini.model.js";
import { config } from "../config.js";

export class ModelFactory {
  static createModel(modelType) {
    switch (modelType) {
      case "openai":
        return new OpenAIModel(config);
      case "anthropic":
        return new AnthropicModel(config);
      case "gemini":
        return new GeminiModel(config);
      default:
        console.warn(
          `Unknown model type: ${modelType}, falling back to OpenAI`
        );
        return new OpenAIModel(config);
    }
  }
}

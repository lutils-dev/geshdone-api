import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseModel } from "./base.model.js";
import { HumanMessage } from "@langchain/core/messages";

export class GeminiModel extends BaseModel {
  static Models = {
    GEMINI_2_FLASH: "gemini-2.0-flash-exp",
    GEMINI_PRO_VISION: "gemini-pro-vision",
  };

  constructor(config) {
    super(config);
    this.client = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    this.modelName = config.modelName || GeminiModel.Models.GEMINI_2_FLASH;
    this.model = this.client.getGenerativeModel({ model: this.modelName });
  }

  async generate(prompt, options = {}) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini generation error:", error);
      throw error;
    }
  }

  async generateStream(prompt, options = {}) {
    try {
      const result = await this.model.generateContentStream(prompt);
      return result;
    } catch (error) {
      console.error("Gemini stream error:", error);
      throw error;
    }
  }
}

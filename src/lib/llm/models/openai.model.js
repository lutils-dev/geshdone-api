import { ChatOpenAI } from "@langchain/openai";
import { BaseModel } from "./base.model.js";
import { HumanMessage } from "@langchain/core/messages";

export class OpenAIModel extends BaseModel {
  static Models = {
    GPT4O: "gpt-4o",
    GPT4O_MINI: "gpt-4o-mini",
    GPT4_VISION: "gpt-4-vision-preview",
  };

  constructor(config) {
    super(config);
    this.model = new ChatOpenAI({
      openAIApiKey: config.OPENAI_API_KEY,
      modelName: config.modelName || OpenAIModel.Models.GPT4O_MINI,
      temperature: config.temperature,
      maxRetries: config.maxRetries,
      timeout: config.timeout,
    });
  }

  async generate(prompt, options = {}) {
    try {
      const message = new HumanMessage(prompt);
      const response = await this.model.invoke([message]);
      return response.content;
    } catch (error) {
      console.error("OpenAI generation error:", error);
      throw error;
    }
  }

  async generateStream(prompt, options = {}) {
    try {
      const stream = await this.model.stream(prompt);
      return stream;
    } catch (error) {
      console.error("OpenAI stream error:", error);
      throw error;
    }
  }
}

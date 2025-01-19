import Anthropic from "@anthropic-ai/sdk";
import { BaseModel } from "./base.model.js";
import { HumanMessage } from "@langchain/core/messages";

export class AnthropicModel extends BaseModel {
  static Models = {
    CLAUDE_3_SONNET: "claude-3-5-sonnet-latest",
    CLAUDE_3_HAIKU: "claude-3-5-haiku-latest",
  };

  constructor(config) {
    super(config);
    this.client = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY,
    });
    this.modelName = config.modelName || AnthropicModel.Models.CLAUDE_3_SONNET;
  }

  async generate(prompt, options = {}) {
    try {
      const message = await this.client.messages.create({
        model: this.modelName,
        max_tokens: 4096,
        temperature: options.temperature || this.config.temperature,
        messages: [{ role: "user", content: prompt }],
      });

      return message.content[0].text;
    } catch (error) {
      console.error("Anthropic generation error:", error);
      throw error;
    }
  }

  async generateStream(prompt, options = {}) {
    try {
      const stream = await this.client.messages.create({
        model: this.modelName,
        max_tokens: 4096,
        temperature: options.temperature || this.config.temperature,
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });
      return stream;
    } catch (error) {
      console.error("Anthropic stream error:", error);
      throw error;
    }
  }
}

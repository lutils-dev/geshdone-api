import { BaseChain } from "./base.chain.js";

export class PromptChain extends BaseChain {
  constructor(model, parser, template) {
    super(model, parser);
    this.template = template;
  }

  async run(input, options = {}) {
    try {
      const formattedPrompt = await this.template.format(input);

      const response = await this.model.generate(formattedPrompt, options);

      let content = "";
      if (typeof response === "string") {
        content = response;
      } else if (response.content) {
        content = response.content;
      } else if (response.text) {
        content = response.text;
      } else {
        throw new Error("Unexpected response format from LLM");
      }

      return this.parser.parse(content);
    } catch (error) {
      console.error("Chain execution error:", error);
      throw new Error(`Chain execution error: ${error.message}`);
    }
  }
}

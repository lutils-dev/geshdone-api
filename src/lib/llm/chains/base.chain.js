import { z } from "zod";

export class BaseChain {
  constructor(model, parser) {
    this.model = model;
    this.parser = parser;
  }

  async run(input, options = {}) {
    throw new Error("Method not implemented");
  }

  async validate(input, schema) {
    try {
      return schema.parse(input);
    } catch (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
  }
}

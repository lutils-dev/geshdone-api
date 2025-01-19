export class BaseModel {
  constructor(config) {
    this.config = config;
  }

  async generate(prompt, options = {}) {
    throw new Error("Method not implemented");
  }

  async generateStream(prompt, options = {}) {
    throw new Error("Method not implemented");
  }
}

import { PromptChain } from "../../lib/llm/chains/prompt.chain.js";
import { extractJSON } from "../../lib/utils/json.util.js";
import { analyzePrompt } from "./prompts/analyze.prompt.js";
import { z } from "zod";

const inputSchema = z.object({
  prompt: z.string(),
  userId: z.string(),
});

const outputSchema = z.object({
  mainGoal: z.string(),
  timeline: z.string(),
  metrics: z.array(z.string()),
  keywords: z.array(z.string()),
  suggestedStyle: z.string(),
  designContext: z.object({
    emotionalTone: z.string(),
    colorStyle: z.enum([
      "professional",
      "vibrant",
      "pastel",
      "dark",
      "neon",
      "natural",
    ]),
    visualStyle: z.enum([
      "minimal",
      "bold",
      "corporate",
      "artistic",
      "modern",
      "traditional",
    ]),
    emphasis: z.enum([
      "achievement",
      "process",
      "inspiration",
      "data",
      "balance",
    ]),
  }),
});

export class VisionBoardAnalyzeChain extends PromptChain {
  constructor(model) {
    super(
      model,
      {
        parse: (response) => {
          try {
            const parsed = extractJSON(response);
            return outputSchema.parse(parsed);
          } catch (error) {
            console.error("Parsing error:", error);
            console.log("Raw response:", response);
            throw new Error("Failed to parse LLM response as JSON");
          }
        },
      },
      analyzePrompt
    );
    this.inputSchema = inputSchema;
  }
}

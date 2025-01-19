import { PromptChain } from "../../lib/llm/chains/prompt.chain.js";
import { extractJSON } from "../../lib/utils/json.util.js";
import { layoutPrompt } from "./prompts/layout.prompt.js";
import { z } from "zod";

const inputSchema = z.object({
  analysis: z.object({
    mainGoal: z.string(),
    timeline: z.string(),
    metrics: z.array(z.string()),
    keywords: z.array(z.string()),
    suggestedStyle: z.string(),
  }),
});

const outputSchema = z.object({
  canvasSize: z.object({
    width: z.number(),
    height: z.number(),
  }),
  theme: z.object({
    background: z.string(),
    primary_color: z.string(),
    accent_color: z.string(),
    font_family: z.string(),
  }),
  elements: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["image", "text"]),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      size: z.object({
        width: z.number(),
        height: z.number(),
      }),
      rotation: z.number().optional(),
      zIndex: z.number(),
      style: z.object({
        opacity: z.number().optional(),
        blur: z.number().optional(),
        border_radius: z.number().optional(),
        font_size: z.number().optional(),
        font_weight: z.string().optional(),
        color: z.string().optional(),
        text_align: z.string().optional(),
        shadow: z
          .object({
            color: z.string(),
            blur: z.number(),
            offset: z.object({
              x: z.number(),
              y: z.number(),
            }),
          })
          .nullable()
          .optional(),
      }),
      content: z.string().optional(),
      imageKeywords: z.array(z.string()).optional(),
    })
  ),
});

export class VisionBoardLayoutChain extends PromptChain {
  constructor(model) {
    super(
      model,
      {
        parse: (response) => {
          const parsed = extractJSON(response);
          return outputSchema.parse(parsed);
        },
      },
      layoutPrompt
    );
    this.inputSchema = inputSchema;
  }

  async run(input) {
    const validInput = await this.validate(input, this.inputSchema);
    return super.run(validInput);
  }
}

import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  DEFAULT_MODEL: z.enum(["openai", "anthropic", "gemini"]).default("openai"),
});

export const config = {
  ...envSchema.parse(process.env),
  temperature: 0.7,
  maxRetries: 3,
  timeout: 30000,
};

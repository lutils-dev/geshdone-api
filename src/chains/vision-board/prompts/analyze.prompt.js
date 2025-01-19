import { PromptTemplate } from "@langchain/core/prompts";

export const analyzePrompt = new PromptTemplate({
  template: `Analyze the following vision board goal and extract key information with design context:
Goal: {prompt}

Think like a professional UI/UX designer and provide a structured analysis including:
1. Goal Analysis:
   - Main goal and its emotional impact
   - Timeline and urgency
   - Specific measurable metrics
   - Key achievement milestones

2. Visual Direction:
   - Consider the emotional tone (motivational, peaceful, energetic, professional, etc.)
   - Identify suitable color palette type (professional, vibrant, pastel, dark, neon, etc.)
   - Determine visual style (minimal, bold, corporate, artistic, etc.)
   - Consider cultural and professional context

3. Keywords for Visual Elements:
   - Select imagery that reinforces the goal
   - Consider metaphorical and literal representations
   - Think about professional and aspirational imagery

Respond in JSON format with this structure:
{{
  "mainGoal": string,
  "timeline": string,
  "metrics": string[],
  "keywords": string[],
  "suggestedStyle": string,
  "designContext": {{
    "emotionalTone": string,
    "colorStyle": "professional" | "vibrant" | "pastel" | "dark" | "neon" | "natural",
    "visualStyle": "minimal" | "bold" | "corporate" | "artistic" | "modern" | "traditional",
    "emphasis": "achievement" | "process" | "inspiration" | "data" | "balance"
  }}
}}`,
  inputVariables: ["prompt"],
});

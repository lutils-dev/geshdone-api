import { PromptTemplate } from "@langchain/core/prompts";

export const layoutPrompt = new PromptTemplate({
  template: `As a professional UI designer, create a vision board layout based on this analysis:
Analysis: {analysis}

Design Guidelines:
1. Typography:
   - Text should never have shadows (maintain clarity)
   - Use font size hierarchy for visual importance
   - Maintain readable contrast with background
   - Use font weights for emphasis instead of effects

2. Color Usage:
   - Professional: Neutral backgrounds, accent colors for emphasis
   - Vibrant: Bold colors, white space for balance
   - Pastel: Soft tones, gentle transitions
   - Dark: Rich dark backgrounds, bright accents
   - Neon: Dark background, glowing accent colors
   - Natural: Earth tones, organic color combinations

3. Image Treatment:
   - Border radius: Use for softer themes (pastel, natural)
   - Sharp edges: Use for professional/bold themes
   - Opacity: Subtle variations for layering (0.8-1.0)
   - Size: Impactful for main goals, smaller for supporting elements

4. Layout Principles:
   - Maintain visual hierarchy
   - Use whitespace effectively
   - Create focal points
   - Balance text and images
   - Consider reading patterns (Z-pattern, F-pattern)

Respond in JSON format with this structure:
{{
  "canvasSize": {{
    "width": number (800-1200),
    "height": number (600-900)
  }},
  "theme": {{
    "background": "color hex",
    "primary_color": "color hex",
    "accent_color": "color hex",
    "font_family": "font name (Inter, Roboto, etc.)",
    "style": "minimal" | "bold" | "corporate" | "artistic"
  }},
  "elements": [
    {{
      "id": "unique string",
      "type": "image" | "text",
      "position": {{ "x": number, "y": number }},
      "size": {{ "width": number, "height": number }},
      "rotation": number (0-10 for subtle rotation),
      "zIndex": number,
      "style": {{
        "opacity": number (0.8-1),
        "blur": number (0-3),
        "border_radius": number (0-16),
        "font_size": number (14-64),
        "font_weight": "normal" | "medium" | "semibold" | "bold",
        "color": "color hex",
        "text_align": "left" | "center" | "right",
        "shadow": {{ // Only for images in certain styles
          "color": "rgba string",
          "blur": number (5-20),
          "offset": {{ "x": number (0-4), "y": number (0-4) }}
        }}
      }},
      "content": "string for text",
      "imageKeywords": ["keywords for image search"]
    }}
  ]
}}

Design Context Rules:
1. For professional goals:
   - Clean layouts, minimal decoration
   - Standard grid alignment
   - Conservative color palette
   - Emphasis on typography

2. For personal/creative goals:
   - More dynamic layouts
   - Artistic element arrangement
   - Expressive color schemes
   - Varied visual elements

3. For achievement/metrics goals:
   - Clear hierarchy
   - Prominent numbers/statistics
   - Progress-oriented imagery
   - Structured layout

4. For inspirational goals:
   - Emphasis on imagery
   - Motivational quotes
   - Aspirational visuals
   - Emotional color schemes

Apply these rules based on the analysis.designContext provided.`,
  inputVariables: ["analysis"],
});

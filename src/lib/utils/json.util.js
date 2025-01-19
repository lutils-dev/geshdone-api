export function extractJSON(text) {
  const normalizedText = text.replace(/\n/g, " ").trim();

  const match = normalizedText.match(/(\[.*\]|\{.*\})/);

  if (!match) {
    throw new Error("No JSON structure found in response");
  }

  try {
    const jsonStr = match[0].replace(/\\_/g, "_");
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("JSON parsing error:", error);
    console.log("Attempted to parse:", match[0]);
    throw new Error("Failed to parse extracted JSON structure");
  }
}

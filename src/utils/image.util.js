import { config } from "dotenv";

config();

export async function searchImages(query, options = {}) {
  const { limit = 5, page = 1 } = options;

  try {
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: SEARCH_ENGINE_ID,
      q: query,
      searchType: "image",
      num: limit,
      start: (page - 1) * limit + 1,
      safe: "active",
      imgSize: "large",
      imgType: "photo",
    });

    const response = await fetch(
      `https://customsearch.googleapis.com/customsearch/v1?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Image search failed");
    }

    const data = await response.json();

    const images =
      data.items?.map((item) => ({
        original_url: item.link,
        thumbnail_url: item.image.thumbnailLink,
        source: item.displayLink,
        attribution: {
          author: item.displayLink,
          author_url: item.image.contextLink,
          license: "Google Search",
        },
        meta: {
          width: item.image.width,
          height: item.image.height,
          size: item.image.byteSize,
          type: item.mime,
        },
      })) || [];

    return images;
  } catch (error) {
    console.error("Image search error:", error);
    return [];
  }
}

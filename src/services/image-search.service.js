import { google } from "googleapis";
import axios from "axios";
import NodeCache from "node-cache";
import PQueue from "p-queue";

export class ImageSearchService {
  constructor() {
    this.customSearch = google.customsearch("v1");
    this.cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.cache = new NodeCache({ stdTTL: 3600 });

    this.queue = new PQueue({
      concurrency: 3,
      timeout: 10000,
      throwOnTimeout: true,
    });

    this.queue.on("active", () => {
      console.log(
        `Working on image. Size: ${this.queue.size} Pending: ${this.queue.pending}`
      );
    });

    this.queue.on("error", (error) => {
      console.error("Queue error:", error);
    });
  }

  async searchImages(query, options = {}) {
    try {
      const { limit = 5 } = options;

      const response = await this.customSearch.cse.list({
        cx: this.cx,
        q: query,
        auth: this.apiKey,
        searchType: "image",
        num: limit,
        safe: "active",
        imgSize: "large",
      });

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map((item) => ({
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
      }));
    } catch (error) {
      console.error("Image search error:", error);
      throw new Error("Failed to search images");
    }
  }

  async getImageBase64(imageUrl) {
    try {
      const cached = this.cache.get(imageUrl);
      if (cached) {
        return cached;
      }

      return this.queue.add(
        async () => {
          const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 5000,
          });

          const contentType = response.headers["content-type"];
          const base64 = Buffer.from(response.data, "binary").toString(
            "base64"
          );
          const dataUrl = `data:${contentType};base64,${base64}`;

          this.cache.set(imageUrl, dataUrl);

          return dataUrl;
        },
        {
          priority: 1,
        }
      );
    } catch (error) {
      if (error.name === "TimeoutError") {
        throw new Error("Image processing timed out");
      }
      console.error("Error converting image to base64:", error);
      throw new Error("Failed to process image");
    }
  }

  async validateImage(imageUrl) {
    return this.queue.add(
      async () => {
        try {
          const response = await axios.head(imageUrl);
          const contentType = response.headers["content-type"];
          const contentLength = response.headers["content-length"];

          if (!contentType.startsWith("image/")) {
            throw new Error("Invalid image type");
          }

          if (contentLength > 5 * 1024 * 1024) {
            throw new Error("Image too large");
          }

          return true;
        } catch (error) {
          console.error("Image validation error:", error);
          throw new Error("Invalid image");
        }
      },
      {
        priority: 2,
      }
    );
  }

  async getImageBase64WithValidation(imageUrl) {
    await this.validateImage(imageUrl);
    return this.getImageBase64(imageUrl);
  }

  getQueueStatus() {
    return {
      size: this.queue.size,
      pending: this.queue.pending,
      isPaused: this.queue.isPaused,
    };
  }

  clearQueue() {
    this.queue.clear();
  }

  pauseQueue() {
    this.queue.pause();
  }

  resumeQueue() {
    this.queue.start();
  }
}

import { ImageSearchService } from "../../services/image-search.service.js";

const imageSearchService = new ImageSearchService();

export const searchImages = async (ctx) => {
  try {
    const { q: query } = ctx.query;

    if (!query) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Search query is required",
      };
      return;
    }

    const images = await imageSearchService.searchImages(query);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: images,
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

export const getImageDetails = async (ctx) => {
  try {
    const { url } = ctx.query;

    if (!url) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Image URL is required",
      };
      return;
    }

    const queueStatus = imageSearchService.getQueueStatus();

    if (queueStatus.size > 50) {
      ctx.status = 503;
      ctx.body = {
        success: false,
        message: "Server is busy, please try again later",
        queueStatus,
      };
      return;
    }

    const imageData = await imageSearchService.getImageBase64WithValidation(
      url
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        base64: imageData,
        queueStatus,
      },
    };
  } catch (error) {
    ctx.status =
      error.message === "Image processing timed out"
        ? 408
        : error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
};

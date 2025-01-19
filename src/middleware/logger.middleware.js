export const requestLogger = async (ctx, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log("\n-------------------");
  console.log(`[${requestId}] ${new Date().toISOString()} Request:`, {
    method: ctx.method,
    url: ctx.url,
    query: ctx.query,
    body: ctx.request.body,
    headers: {
      "content-type": ctx.headers["content-type"],
      authorization: ctx.headers.authorization ? "Present" : "None",
      ...ctx.headers,
    },
    ip: ctx.ip,
  });

  try {
    await next();

    const ms = Date.now() - start;
    console.log(
      `[${requestId}] ${new Date().toISOString()} Response: ${ms}ms`,
      {
        status: ctx.status,
        body: ctx.body,
        error: ctx.body?.error,
      }
    );
  } catch (error) {
    const ms = Date.now() - start;
    console.error(`[${requestId}] ${new Date().toISOString()} Error: ${ms}ms`, {
      status: error.status || 500,
      message: error.message,
      stack: error.stack,
      body: ctx.body,
    });
    throw error;
  }
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", {
    message: error.message,
    stack: error.stack,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", {
    reason,
    promise,
  });
});

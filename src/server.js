import { config } from "dotenv";
import app from "./app.js";
import { AppDataSource } from "./config/database.js";

config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../entities/user.entity.js";
import { Board } from "../entities/board.entity.js";
import { BoardElement } from "../entities/boardElement.entity.js";
import { License } from "../entities/license.entity.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Order } from "../entities/order.entity.js";
import { Configuration } from "../entities/configuration.entity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const isTest = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: `${process.env.DB_DATABASE}${isTest ? "_test" : ""}`,
  synchronize: false,
  dropSchema: isTest,
  logging: true,
  entities: [User, Board, BoardElement, License, Order, Configuration],
  migrations: [join(__dirname, "../migrations/*{.ts,.js}")],
  migrationsRun: false,
  migrationsTableName: "migrations",
});

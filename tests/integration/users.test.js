import request from "supertest";
import app from "../../src/app.js";
import { AppDataSource } from "../../src/config/database.js";
import { User } from "../../src/entities/user.entity.js";

describe("User API", () => {
  beforeAll(async () => {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      const repository = AppDataSource.getRepository(User);
      await repository.clear();
    } catch (error) {
      console.error("Test setup failed:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    const repository = AppDataSource.getRepository(User);
    await repository.clear();
  });

  let userId;

  it("should create a new user", async () => {
    const response = await request(app.callback()).post("/api/v1/users").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.email).toBe("test@example.com");

    userId = response.body.data.id;
  });

  it("should get user by id", async () => {
    const createResponse = await request(app.callback())
      .post("/api/v1/users")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    const userId = createResponse.body.data.id;

    const response = await request(app.callback()).get(
      `/api/v1/users/${userId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(userId);
    expect(response.body.data.email).toBe("test@example.com");
  });

  it("should reject duplicate email", async () => {
    await request(app.callback()).post("/api/v1/users").send({
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app.callback()).post("/api/v1/users").send({
      email: "test@example.com",
      password: "password456",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User with this email already exists");
  });

  it("should reject short password", async () => {
    const response = await request(app.callback()).post("/api/v1/users").send({
      email: "another@example.com",
      password: "12345",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain(
      "Password must be at least 6 characters long"
    );
  });
});

import request from "supertest";
import pool from "../../src/config/db";
import { createApp } from "../../src/app";
import redis from "../../src/config/redisClient";
import { ProductModel, StoreModel, InventoryModel } from "../../src/models";

const app = createApp({
  storeModel: StoreModel,
  productModel: ProductModel,
  inventoryModel: InventoryModel,
});

afterAll(async () => {
  await pool.end();
  await redis.quit();
});

describe("API", () => {
  const apiPrefix = "/api";

  it("GET /health should return 200 and 'Ok' service message", async () => {
    const res = await request(app).get(`${apiPrefix}/health`);
    expect(res.status).toBe(200);
    expect(res.body.service).toBe("Ok");
  });
});

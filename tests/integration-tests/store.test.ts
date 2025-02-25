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

describe("Store", () => {
  const apiPrefix = "/api";

  it("GET /stores/:id/inventory - Read inventory by store id", async () => {
    const res = await request(app).get(
      `${apiPrefix}/stores/123e4567-e89b-12d3-a456-426614174000/inventory`
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /stores/:id/inventory - Read inventory by not existing store id", async () => {
    const res = await request(app).get(
      `${apiPrefix}/stores/123e4567-e89b-12d3-a456-426614174001/inventory`
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Store not found");
  });
});

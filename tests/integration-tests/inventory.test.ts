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

describe("Inventory", () => {
  const apiPrefix = "/api";

  it("POST /inventory/transfer - Transfer a product", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/inventory/transfer`)
      .send({
        productId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        sourceStoreId: "123e4567-e89b-12d3-a456-426614174000",
        targetStoreId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        quantity: 1,
        timestamp: "2024-02-12",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product transferred successfully");
  });

  it("POST /inventory/transfer - Transfer a product with missing fields", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/inventory/transfer`)
      .send({
        productId: "2c6d48ab-b4d1-4a2f-8fc3-6bc36a597693",
        sourceStoreId: "123e4567-e89b-12d3-a456-426614174000",
        targetStoreId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        quantity: 1,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation errors");
  });

  it("POST /inventory/transfer - Transfer a not existing product", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/inventory/transfer`)
      .send({
        productId: "66839989-18cb-4306-b9c1-a8d8f607cfa3",
        sourceStoreId: "123e4567-e89b-12d3-a456-426614174000",
        targetStoreId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        quantity: 1,
        timestamp: "2024-02-12",
      });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("POST /inventory/transfer - Transfer a product with not existing source store", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/inventory/transfer`)
      .send({
        productId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        sourceStoreId: "123e4567-e89b-12d3-a456-426614174001",
        targetStoreId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        quantity: 1,
        timestamp: "2024-02-12",
      });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Source store not found");
  });

  it("POST /inventory/transfer - Transfer a product with not existing target store", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/inventory/transfer`)
      .send({
        productId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        sourceStoreId: "123e4567-e89b-12d3-a456-426614174000",
        targetStoreId: "f47ac10b-58cc-4372-a567-0e02b2c3d478",
        quantity: 1,
        timestamp: "2024-02-12",
      });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Target store not found");
  });

  it("POST /inventory/transfer - Transfer a product with insufficient stock", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/inventory/transfer`)
      .send({
        productId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        sourceStoreId: "123e4567-e89b-12d3-a456-426614174000",
        targetStoreId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        quantity: 100,
        timestamp: "2024-02-12",
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Insufficient stock");
  });

  it("GET /inventory/alerts - Get inventory alerts", async () => {
    const res = await request(app).get(`${apiPrefix}/inventory/alerts`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

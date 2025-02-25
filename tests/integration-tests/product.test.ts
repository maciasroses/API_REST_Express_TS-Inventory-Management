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

describe("Products", () => {
  const apiPrefix = "/api";

  it("GET /products - Read all products", async () => {
    const res = await request(app).get(`${apiPrefix}/products`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /products - Create a product", async () => {
    const res = await request(app).post(`${apiPrefix}/products`).send({
      name: "test from jest",
      description: "test from jest",
      category: "test from jest",
      price: 22,
      sku: "test from jest",
      storeId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 22,
      minStock: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("test from jest");
  });

  it("POST /products - Create a product with missing fields", async () => {
    const res = await request(app).post(`${apiPrefix}/products`).send({
      name: "test from jest",
      price: 22,
      sku: "test from jest",
      quantity: 22,
      minStock: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation errors");
  });

  it("POST /products - Create a product with the same SKU", async () => {
    const res = await request(app).post(`${apiPrefix}/products`).send({
      name: "test from jest",
      description: "test from jest",
      category: "test from jest",
      price: 22,
      sku: "MONITOR-4K-003",
      storeId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 22,
      minStock: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Product with this SKU already exists");
  });

  it("POST /products - Create a product with a not existing store", async () => {
    const res = await request(app).post(`${apiPrefix}/products`).send({
      name: "test from jest",
      description: "test from jest",
      category: "test from jest",
      price: 22,
      sku: "test from jest 2",
      storeId: "a1b2c3d4-e56f-78a9-b012-345678901233",
      quantity: 22,
      minStock: 2,
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Store not found");
  });

  it("GET /products/:id - Read a product", async () => {
    const res = await request(app).get(
      `${apiPrefix}/products/bb7cfc89-4137-4823-a1a2-65a3f5c4573e`
    );
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("4K Monitor");
  });

  it("GET /products/:id - Read a product with an invalid UUID", async () => {
    const res = await request(app).get(`${apiPrefix}/products/no-uuid-valid`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid UUID");
  });

  it("GET /products/:id - Read a not found product", async () => {
    const res = await request(app).get(
      `${apiPrefix}/products/123e4567-e89b-12d3-a456-426614174000`
    );
    expect(res.status).toBe(404);
  });

  it("PUT /products/:id - Update a product", async () => {
    const updatedProduct = {
      name: "4K Monitor updated",
      description: "27-inch monitor with 4K resolution",
      category: "Electronics",
      price: 300,
      sku: "MONITOR-4K-003",
      storeId: "a1b2c3d4-e56f-78a9-b012-345678901234",
      quantity: 0,
      minStock: 2,
    };

    const res = await request(app)
      .put(`${apiPrefix}/products/bb7cfc89-4137-4823-a1a2-65a3f5c4573e`)
      .send(updatedProduct);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("4K Monitor updated");
  });

  it("PUT /products/:id - Update a product with missing fields", async () => {
    const updatedProduct = {
      name: "4K Monitor without some fields",
      description: "27-inch monitor with 4K resolution",
      minStock: 2,
    };

    const res = await request(app)
      .put(`${apiPrefix}/products/bb7cfc89-4137-4823-a1a2-65a3f5c4573e`)
      .send(updatedProduct);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation errors");
  });

  it("DELETE /products/:id - Delete a product", async () => {
    const res = await request(app).delete(
      `${apiPrefix}/products/bb7cfc89-4137-4823-a1a2-65a3f5c4573e`
    );
    expect(res.status).toBe(204);
  });

  it("DELETE /products/:id - Delete a not found product", async () => {
    const res = await request(app).delete(
      `${apiPrefix}/products/123e4567-e89b-12d3-a456-426614174000`
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});

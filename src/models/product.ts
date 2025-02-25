import pool from "../config/db";
import type {
  IProductCreateNUpdate,
  IProductSearchParams,
} from "../interfaces";

export class ProductModel {
  static async getAllProducts({
    category,
    minPrice,
    maxPrice,
    minStock,
    maxStock,
    page = 1,
    limit = 2,
  }: IProductSearchParams) {
    const offset = (page - 1) * limit;
    const params = [];

    let query = `
      SELECT p.*, i.quantity as stock, s.id as storeId
      FROM product p
      JOIN inventory i ON p.id = i.productId
      JOIN store s ON i.storeId = s.id
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM product p
      JOIN inventory i ON p.id = i.productId
      JOIN store s ON i.storeId = s.id
      WHERE 1=1
    `;

    if (category) {
      console.log("category", category);
      params.push(category);
      query += ` AND p.category = $${params.length}`;
      countQuery += ` AND p.category = $${params.length}`;
    }

    if (minPrice) {
      params.push(minPrice);
      query += ` AND p.price >= $${params.length}`;
      countQuery += ` AND p.price >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND p.price <= $${params.length}`;
      countQuery += ` AND p.price <= $${params.length}`;
    }

    if (minStock) {
      params.push(minStock);
      query += ` AND i.quantity >= $${params.length}`;
      countQuery += ` AND i.quantity >= $${params.length}`;
    }

    if (maxStock) {
      params.push(maxStock);
      query += ` AND i.quantity <= $${params.length}`;
      countQuery += ` AND i.quantity <= $${params.length}`;
    }

    params.push(limit, offset);
    query += ` ORDER BY p.name ASC LIMIT $${params.length - 1} OFFSET $${
      params.length
    };`;

    const [countRes, dataRes] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(query, params),
    ]);

    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: dataRes.rows,
      pagination: {
        total,
        page,
        page_size: limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_previous: page > 1,
      },
    };
  }

  static async getProductById(id: string) {
    const query = `
      SELECT p.*, i.quantity as stock
      FROM product p
      JOIN inventory i ON p.id = i.productId
      WHERE p.id = $1;
    `;
    const res = await pool.query(query, [id]);
    return res.rows[0];
  }

  static async getProductBySku(sku: string) {
    const query = `
      SELECT p.*, i.quantity as stock
      FROM product p
      JOIN inventory i ON p.id = i.productId
      WHERE p.sku = $1;
    `;
    const res = await pool.query(query, [sku]);
    return res.rows[0];
  }

  static async createProduct({
    name,
    description,
    category,
    price,
    sku,
    storeId,
    quantity,
    minStock,
  }: IProductCreateNUpdate) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const productQuery = `
        INSERT INTO product (name, description, category, price, sku)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const productRes = await client.query(productQuery, [
        name,
        description,
        category,
        price,
        sku,
      ]);
      const productId = productRes.rows[0].id as string;

      const inventoryQuery = `
        INSERT INTO inventory (productId, storeId, quantity, minStock)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      await client.query(inventoryQuery, [
        productId,
        storeId,
        quantity,
        minStock,
      ]);

      await client.query("COMMIT");
      return productRes.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateProduct(id: string, productData: IProductCreateNUpdate) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const productQuery = `
        UPDATE product
        SET name = $1, description = $2, category = $3, price = $4, sku = $5
        WHERE id = $6
        RETURNING *;
      `;
      const productRes = await client.query(productQuery, [
        productData.name,
        productData.description,
        productData.category,
        productData.price,
        productData.sku,
        id,
      ]);

      const inventoryQuery = `
        UPDATE inventory
        SET quantity = $1, minStock = $2
        WHERE productId = $3 AND storeId = $4
        RETURNING *
      `;
      await client.query(inventoryQuery, [
        productData.quantity,
        productData.minStock,
        id,
        productData.storeId,
      ]);

      await client.query("COMMIT");
      return productRes.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteProduct(id: string) {
    const query = `
      DELETE FROM product
      WHERE id = $1;
    `;
    await pool.query(query, [id]);
  }
}

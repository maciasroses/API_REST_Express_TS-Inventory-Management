import pool from "../config/db";
import { IInventoryTransfer } from "../interfaces";

export class InventoryModel {
  static async getInventoryByStoreId(storeId: string) {
    const query = `
        SELECT i.id, i.productId, p.name as product, i.quantity, i.minStock
        FROM inventory i
        JOIN product p ON i.productId = p.id
        WHERE i.storeId = $1
        ORDER BY p.name ASC;
    `;

    const res = await pool.query(query, [storeId]);
    return res.rows;
  }

  static async getStockByProductIdNStoreId(
    productId: string,
    storeId: string
  ): Promise<number> {
    const query = `
        SELECT quantity
        FROM inventory
        WHERE productId = $1 AND storeId = $2;
    `;

    const res = await pool.query(query, [productId, storeId]);
    return res.rows.length > 0 ? res.rows[0].quantity : 0;
  }

  static async transferProduct({
    productId,
    sourceStoreId,
    targetStoreId,
    quantity,
    timestamp,
  }: IInventoryTransfer) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updateSourceQuery = `
        UPDATE inventory
        SET quantity = quantity - $1
        WHERE productId = $2 AND storeId = $3
        RETURNING *;
      `;
      const source = await client.query(updateSourceQuery, [
        quantity,
        productId,
        sourceStoreId,
      ]);
      const sourceMinStock = source.rows[0].minstock as number;

      const updateTargetQuery = `
        INSERT INTO inventory (productId, storeId, quantity, minStock)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (productId, storeId)
        DO UPDATE SET quantity = inventory.quantity + $3;
      `;
      await client.query(updateTargetQuery, [
        productId,
        targetStoreId,
        quantity,
        sourceMinStock,
      ]);

      const movementTransferQuery = `
        INSERT INTO movement (productId, sourceStoreId, targetStoreId, quantity, timestamp, type)
        VALUES ($1, $2, $3, $4, $5, 'TRANSFER');
      `;
      await client.query(movementTransferQuery, [
        productId,
        sourceStoreId,
        targetStoreId,
        quantity,
        timestamp,
      ]);

      const movementOutQuery = `
        INSERT INTO movement (productId, sourceStoreId, quantity, timestamp, type)
        VALUES ($1, $2, $3, $4, 'OUT');
      `;
      await client.query(movementOutQuery, [
        productId,
        sourceStoreId,
        quantity,
        timestamp,
      ]);

      const movementInQuery = `
            INSERT INTO movement (productId, targetStoreId, quantity, timestamp, type)
            VALUES ($1, $2, $3, $4, 'IN');
        `;
      await client.query(movementInQuery, [
        productId,
        targetStoreId,
        quantity,
        timestamp,
      ]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getLowStockAlerts() {
    const query = `
        SELECT i.storeId, i.productId, p.name as product, i.quantity, i.minStock
        FROM inventory i
        JOIN product p ON i.productId = p.id
        JOIN store s ON i.storeId = s.id
        WHERE i.quantity < i.minStock
        ORDER BY i.quantity ASC;
    `;

    const res = await pool.query(query);
    return res.rows;
  }
}

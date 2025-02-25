import pool from "../config/db";

export class StoreModel {
  static async getStoreById(storeId: string) {
    const query = `
        SELECT *
        FROM store
        WHERE id = $1;
    `;

    const res = await pool.query(query, [storeId]);
    return res.rows[0];
  }
}

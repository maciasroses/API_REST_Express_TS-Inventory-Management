import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5434/postgres",
});

const checkConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connection successful:", res.rows[0]);
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

checkConnection();

export default pool;

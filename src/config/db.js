import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// DEBUG OPTIONAL
console.log("ENV CHECK:", process.env.DATABASE_URL ? "OK" : "NOT FOUND");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL 🚀");
  } catch (error) {
    console.error("Database connection error ❌", error);
  }
};

export default pool;
export { connectDB };
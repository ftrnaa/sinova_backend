import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

console.log("ENV CHECK:", process.env.DB_USER, process.env.DB_PASSWORD);

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // wajib untuk Railway
    },
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

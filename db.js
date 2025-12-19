const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_sinova",
  password: "210406",   // ganti dengan password PostgreSQL kamu
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

module.exports = pool;

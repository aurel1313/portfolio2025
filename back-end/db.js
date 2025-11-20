//connect to database
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
   user: process.env.NILEDB_USER,
    host: "eu-central-1.db.thenile.dev",
    database: "portfolio",
    password: process.env.NILEDB_PASSWORD,
    port: 5432,
});
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
export { pool };
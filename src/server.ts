import app from "./app";
import { pool } from "./config/db";
import { env } from "./config/env";

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection error", err);
    process.exit(1);
  }
}

start();
import { Pool } from "pg";
import { config } from "../config/config";

export const pool = new Pool({
    connectionString: config.db.connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    max: config.db.max,
    min: config.db.min,
    idleTimeoutMillis: config.db.idleTimeoutMillis,
    connectionTimeoutMillis: config.db.connectionTimeoutMillis,
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error", error);
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log("Database connected");
    } catch (error) {
        console.log("Database error", error);
    }
}

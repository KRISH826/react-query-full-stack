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
})

export const connectDB = async () => {
    try {
        await pool.connect();
        console.log("Database connected");
    } catch (error) {
        console.log("Database error", error);
    }
}

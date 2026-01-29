import { pool } from "../../db/db";
import { CreateUserDTO, UserDB } from "../../models/user";

export async function findByEmail(email: string): Promise<UserDB | null> {
    const { rows } = await pool.query<UserDB>(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    )
    return rows[0] || null;
}

export async function findById(id: string): Promise<UserDB | null> {
    const { rows } = await pool.query<UserDB>(
        `SELECT * FROM users WHERE id=$1`,
        [id]
    )
    return rows[0] || null;
}

export async function createUser(data: CreateUserDTO): Promise<UserDB | null> {
    const { rows } = await pool.query<UserDB>(
        `INSERT INTO users (
            name, email, password, role, profileimage, address
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [data.name, data.email, data.password, data.role, data.profileimage, data.address]
    )
    return rows[0] || null;
}

export async function findAll(): Promise<UserDB[] | null> {
    const { rows } = await pool.query<UserDB>(
        `SELECT * FROM users`
    )
    return rows || null;
}

export async function logout(id: string): Promise<UserDB | null> {
    const { rows } = await pool.query<UserDB>(
        `UPDATE users SET token_version=token_version+1 WHERE id=$1 RETURNING *`,
        [id]
    )
    return rows[0] || null;
}
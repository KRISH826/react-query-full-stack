import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateUserDTO, ProfileDto, UserDB } from "../../models/user";

export async function findByEmail(email: string, db: Pool | PoolClient = pool): Promise<UserDB | null> {
    const { rows } = await db.query<UserDB>(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    )
    return rows[0] || null;
}

export async function findById(id: string, db: Pool | PoolClient = pool): Promise<UserDB | null> {
    const { rows } = await db.query<UserDB>(
        `SELECT * FROM users WHERE id=$1`,
        [id]
    )
    return rows[0] || null;
}

export async function createUser(data: CreateUserDTO, db: Pool | PoolClient = pool): Promise<UserDB | null> {
    const { rows } = await db.query<UserDB>(
        `INSERT INTO users (
            name, email, password, role, profileimage, address
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [data.name, data.email, data.password, data.role, data.profileimage, data.address]
    )
    return rows[0] || null;
}

export async function findAll(db: Pool | PoolClient = pool): Promise<UserDB[] | null> {
    const { rows } = await db.query<UserDB>(
        `SELECT * FROM users`
    )
    return rows || null;
}

export async function logout(id: string, db: Pool | PoolClient = pool): Promise<UserDB | null> {
    const { rows } = await db.query<UserDB>(
        `UPDATE users SET token_version=token_version+1 WHERE id=$1 RETURNING *`,
        [id]
    )
    return rows[0] || null;
}

export async function updateProfile(id: string, data: ProfileDto, db: Pool | PoolClient = pool): Promise<UserDB | null> {
    const { rows } = await db.query<UserDB>(
        `UPDATE users SET
        name=$1,
        profileimage=$2,
        address=$3,
        postcode=$4,
        country=$5,
        city=$6
        WHERE id=$7 RETURNING *`,
        [
            data.name ?? null,
            data.profileimage ?? null,
            data.address ?? null,
            data.postcode ?? null,
            data.country ?? null,
            data.city ?? null,
            id
        ]
    )
    return rows[0] || null;
}
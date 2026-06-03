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
        `INSERT INTO users (id, name, email, role, expires_at) 
         VALUES ($1, $2, $3, $4, NOW() + INTERVAL '15 minutes') RETURNING *`,
        [data.id, data.name, data.email, data.role]
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
        city=$6,
        state=$7,
        gender=$8
        WHERE id=$9 RETURNING *`,
        [
            data.name ?? null,
            data.profileimage ?? null,
            data.address ?? null,
            data.postcode ?? null,
            data.country ?? null,
            data.city ?? null,
            data.state ?? null,
            data.gender ?? null,
            id
        ]
    )
    return rows[0] || null;
}

export async function verifyUser(email: string, db: Pool | PoolClient = pool): Promise<UserDB | null> {
    const { rows } = await db.query<UserDB>(
        `UPDATE users SET isverified = TRUE, expires_at= NULL WHERE email = $1 RETURNING *`,
        [email]
    );
    return rows[0] || null;
}


export async function deleteExpiredVerificationUsers(db: Pool | PoolClient = pool): Promise<{ email: string }[]> {
    const { rows } = await db.query<{ email: string }>(
        `DELETE FROM users WHERE isverified = FALSE AND expires_at < NOW() RETURNING email`
    )
    return rows || [];
}


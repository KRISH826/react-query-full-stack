import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { FavouriteWithProductDTO, FavouritesDB, addFavouriteDTO } from "../../models/favourite";

export async function addFavourite(
    dto: addFavouriteDTO,
    db: Pool | PoolClient = pool
): Promise<FavouritesDB> {
    const { rows } = await db.query(
        `INSERT INTO favourite_products (user_id, product_id)
         VALUES ($1, $2)
         RETURNING *`,
        [dto.user_id, dto.product_id]
    );
    return rows[0];
}

export async function removeFavourite(
    userId: string,
    productId: string,
    db: Pool | PoolClient = pool
): Promise<FavouritesDB | null> {
    const { rows } = await db.query(
        `DELETE FROM favourite_products
         WHERE user_id = $1 AND product_id = $2
         RETURNING *`,
        [userId, productId]
    );
    return rows[0] || null;
}

export async function findFavourite(
    userId: string,
    productId: string,
    db: Pool | PoolClient = pool
): Promise<FavouritesDB | null> {
    const { rows } = await db.query(
        `SELECT * FROM favourite_products
         WHERE user_id = $1 AND product_id = $2`,
        [userId, productId]
    );
    return rows[0] || null;
}

export async function clearFavourite(product_id: string, db: Pool | PoolClient = pool) {
    const {rows} = await db.query(`DELETE FROM favourite_products WHERE id = $1 RETURNING *`, [product_id]);
    return rows[0] || null;
}

export async function findAllFavouritesByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
    db: Pool | PoolClient = pool
): Promise<{ data: FavouriteWithProductDTO[]; total: number }> {
    const offset = (page - 1) * limit;

    const countResult = await db.query(
        `SELECT COUNT(*) FROM favourite_products WHERE user_id = $1`,
        [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const { rows } = await db.query(
        `SELECT
            f.id,
            f.user_id,
            f.product_id,
            f.created_at,
            jsonb_build_object(
                'id',            p.id,
                'productname',   p.productname,
                'description',   p.description,
                'brand',         p.brand,
                'gender',        p.gender,
                'status',        p.status,
                'primary_image', img.image_url,
                'variants',      COALESCE(var.variants, '[]')
            ) AS product
        FROM favourite_products f
        JOIN products p ON p.id = f.product_id AND p.deleted_at IS NULL

        LEFT JOIN LATERAL (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.id
              AND pi.isprimary = true
            LIMIT 1
        ) img ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(
                jsonb_build_object(
                    'id',                   v.id,
                    'size',                 v.size,
                    'price_override',       v.price_override,
                    'offer_price_override', v.offer_price_override,
                    'stock_quantity',       v.stock_quantity,
                    'sku',                  v.sku
                )
            ) AS variants
            FROM product_variants v
            WHERE v.product_id = p.id
        ) var ON true

        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
        LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    return { data: rows, total };
}

export async function countFavouritesByUser(
    userId: string,
    db: Pool | PoolClient = pool
): Promise<number> {
    const { rows } = await db.query(
        `SELECT COUNT(*) FROM favourite_products WHERE user_id = $1`,
        [userId]
    );
    return parseInt(rows[0].count);
}
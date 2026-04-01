import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { ProductWithImagesDTO } from "../../models/product";

export const searchProductQuery = async (filters: any, db: Pool | PoolClient = pool): Promise<ProductWithImagesDTO[]> => {
    const { keyword, gender, max_price, limit = 40 } = filters;
    const conditions: string[] = ["p.deleted_at IS NULL"];
    const values: any[] = [];
    let i = 1

    if (keyword) {
        conditions.push(`p.search_vector @@ websearch_to_tsquery('simple', $${i})`);
        values.push(keyword);
        i++;
    }
    if (gender) {
        conditions.push(`p.gender IN ($${i}::gender_enum, 'UNISEX'::gender_enum)`);
        values.push(gender);
        i++;
    }

    if (max_price) {
        conditions.push(`EXISTS (
            SELECT 1 FROM product_variants pv 
            WHERE pv.product_id = p.id 
            AND COALESCE(pv.offer_price_override, pv.price_override) <= $${i}
        )`);
        values.push(max_price);
        i++;
    }

    const query = `
        SELECT 
            p.*, 
            img.images,
            cat.categories,
            var.variants,
            ${keyword ? `ts_rank_cd(p.search_vector, websearch_to_tsquery('simple', $1)) AS score` : `0 AS score`}
        FROM products p

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', pi.id, 'image_url', pi.image_url, 'isprimary', pi.isprimary
            )) AS images
            FROM product_images pi WHERE pi.product_id = p.id AND pi.isprimary = true
        ) img ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', c.id, 'name', c.name, 'slug', c.slug
            )) AS categories
            FROM product_categories pc 
            JOIN categories c ON c.id = pc.category_id
            WHERE pc.product_id = p.id
        ) cat ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(v.*) AS variants 
            FROM product_variants v WHERE v.product_id = p.id
        ) var ON true

        WHERE ${conditions.join(" AND ")}
        ORDER BY score DESC, p.created_at DESC
        LIMIT $${i};
    `;

    values.push(limit);
    const { rows } = await db.query(query, values);
    return rows;
};


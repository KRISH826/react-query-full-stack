import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { ProductWithImagesDTO } from "../../models/product";

export const searchProductQuery = async (filters: any, db: Pool | PoolClient = pool): Promise<ProductWithImagesDTO[]> => {
    const { keyword, gender, max_price, limit = 40 } = filters;
    const conditions: string[] = ["p.deleted_at IS NULL"];
    const values: any[] = [];
    let i = 1;
    let scoreSelect = "0 AS score";
    let orderClause = "ORDER BY p.created_at DESC";

    if (keyword) {
        scoreSelect = `(
            ts_rank_cd(p.search_vector, websearch_to_tsquery('english', $${i})) * 0.7 + 
            similarity(p.productname, $${i}) * 0.3
        ) AS score`;

        conditions.push(`(
            p.search_vector @@ websearch_to_tsquery('english', $${i}) 
            OR p.productname % $${i}
        )`);

        orderClause = "ORDER BY score DESC, p.created_at DESC";
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

    values.push(limit);

    const query = `
        WITH matched_products AS (
            SELECT p.*, ${scoreSelect}
            FROM products p
            WHERE ${conditions.join(" AND ")}
            ${orderClause} -- Yahan 'p' chalega
            LIMIT $${i}
        )
        SELECT 
            mp.*, 
            COALESCE(img.images, '[]'::json) AS images,
            COALESCE(cat.categories, '[]'::json) AS categories,
            COALESCE(var.variants, '[]'::json) AS variants
        FROM matched_products mp

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', pi.id, 'image_url', pi.image_url, 'isprimary', pi.isprimary
            )) AS images
            FROM product_images pi WHERE pi.product_id = mp.id AND pi.isprimary = true
        ) img ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', c.id, 'name', c.name, 'slug', c.slug
            )) AS categories
            FROM product_categories pc 
            JOIN categories c ON c.id = pc.category_id
            WHERE pc.product_id = mp.id
        ) cat ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(v.*) AS variants 
            FROM product_variants v WHERE v.product_id = mp.id
        ) var ON true

        ORDER BY mp.score DESC, mp.created_at DESC;
    `;

    const { rows } = await db.query(query, values);
    return rows;
};
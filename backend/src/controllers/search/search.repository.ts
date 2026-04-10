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
        // Scoring Logic: Name (25%) + Brand (20%) + Description (10%) + Full Text (35%) + Typo (10%)
        scoreSelect = `(
            CASE 
                -- Full-text search match (35% weight)
                WHEN p.search_vector @@ websearch_to_tsquery('english', $${i})
                THEN ts_rank_cd(p.search_vector, websearch_to_tsquery('english', $${i})) * 0.35
                ELSE 0
            END +
            
            -- Exact similarity on Product Name (25% weight)
            GREATEST(
                similarity(p.productname, $${i}),
                word_similarity(p.productname, $${i})
            ) * 0.25 +
            
            -- Exact similarity on Brand (20% weight)
            GREATEST(
                similarity(COALESCE(p.brand, ''), $${i}),
                word_similarity(COALESCE(p.brand, ''), $${i})
            ) * 0.20 +

            -- Word similarity on Description (10% weight) -> word_similarity is better for long text
            word_similarity(COALESCE(p.description, ''), $${i}) * 0.10 +

            -- Levenshtein for typo handling on Name ONLY (10% weight)
            (1 - (levenshtein(LOWER(LEFT(p.productname, 255)), LOWER($${i}))::float / 
                  GREATEST(LENGTH(p.productname), LENGTH($${i}), 1)::float)) * 0.10
        ) AS score`;

        conditions.push(`(
            -- 1. Full Text Search
            p.search_vector @@ websearch_to_tsquery('english', $${i})
            
            -- 2. Word similarity on Name, Brand, OR Description
            OR EXISTS (
                SELECT 1
                FROM unnest(string_to_array($${i}, ' ')) AS kw
                WHERE word_similarity(p.productname, kw) > 0.15 
                   OR word_similarity(COALESCE(p.brand, ''), kw) > 0.15
                   OR word_similarity(COALESCE(p.description, ''), kw) > 0.15
            )
            
            -- 3. Direct similarity check
            OR similarity(p.productname, $${i}) > 0.3 
            OR similarity(COALESCE(p.brand, ''), $${i}) > 0.3
            OR word_similarity(COALESCE(p.description, ''), $${i}) > 0.3
            
            -- 4. Typo tolerance (Levenshtein) on Name and Brand
            OR (levenshtein(LOWER(LEFT(p.productname, 255)), LOWER($${i})) <= 3) 
            OR (levenshtein(LOWER(COALESCE(p.brand, '')), LOWER($${i})) <= 2)
            
            -- 5. Standard ILIKE fallback for Name, Brand, AND Description
            OR p.productname ILIKE '%' || $${i} || '%'
            OR COALESCE(p.brand, '') ILIKE '%' || $${i} || '%'
            OR COALESCE(p.description, '') ILIKE '%' || $${i} || '%'
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
            ${orderClause}
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
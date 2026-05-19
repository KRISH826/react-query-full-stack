import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { ProductWithImagesDTO } from "../../models/product";

export interface SearchProductsResult {
    data: ProductWithImagesDTO[];
    total: number;
    page: number;
    limit: number;
    offset: number;
    totalPages: number;
}

export const searchProductQuery = async (
    filters: any,
    page: number = 1,
    limit: number = 30,
    db: Pool | PoolClient = pool,
): Promise<SearchProductsResult> => {
    const { keyword, gender, max_price, brands, categories, sizes, min_rating } =
        filters;
    const offset = (page - 1) * limit;
    const conditions: string[] = ["p.deleted_at IS NULL", "p.status = 'active'"];
    const values: any[] = [];
    let i = 1;
    let scoreSelect = "0 AS score";
    let orderClause = "ORDER BY p.created_at DESC";

    if (keyword) {
        scoreSelect = `
            CASE
                WHEN p.search_vector @@ websearch_to_tsquery('english', $${i})
                THEN ts_rank_cd(p.search_vector, websearch_to_tsquery('english', $${i}), 32) + 1.0
                ELSE ts_rank_cd(p.search_vector,
                    replace(websearch_to_tsquery('english', $${i})::text, ' & ', ' | ')::tsquery, 32
                ) * 0.5
            END AS score
        `;

        conditions.push(`(
            p.search_vector @@ websearch_to_tsquery('english', $${i})
            OR (
                p.search_vector @@ replace(
                    websearch_to_tsquery('english', $${i})::text, ' & ', ' | '
                )::tsquery
                AND ts_rank_cd(p.search_vector,
                    replace(websearch_to_tsquery('english', $${i})::text, ' & ', ' | ')::tsquery, 32
                ) > 0.03
            )
            OR EXISTS (
                SELECT 1
                FROM unnest(string_to_array($${i}, ' ')) AS kw
                WHERE word_similarity(p.productname, kw) > 0.2
            )
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

    if (brands && brands.length > 0) {
        conditions.push(`p.brand = ANY($${i})`);
        values.push(brands);
        i++;
    }

    if (categories && categories.length > 0) {
        conditions.push(`EXISTS (
        SELECT 1 FROM product_categories pc
        JOIN categories c ON c.id = pc.category_id
        WHERE pc.product_id = p.id AND c.name = ANY($${i})
    )`);
        values.push(categories);
        i++;
    }

    if (sizes && sizes.length > 0) {
        conditions.push(`EXISTS (
        SELECT 1 FROM product_variants pv
        WHERE pv.product_id = p.id AND pv.size = ANY($${i})
    )`);
        values.push(sizes);
        i++;
    }

    if (min_rating) {
        conditions.push(`p.avg_rating >= $${i}`);
        values.push(min_rating);
        i++;
    }

    const countResult = await db.query(
        `SELECT COUNT(*) 
         FROM products p
         WHERE ${conditions.join(" AND ")}`,
        values,
    );

    const total = Number.parseInt(countResult.rows[0].count, 10);
    const limitPlaceholder = i;
    const offsetPlaceholder = i + 1;
    const queryValues = [...values, limit, offset];

    const query = `
        WITH matched_products AS (
            SELECT p.*, ${scoreSelect}
            FROM products p
            WHERE ${conditions.join(" AND ")}
            ${orderClause}
            LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}
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

    const { rows } = await db.query(query, queryValues);
    return {
        data: rows,
        total,
        page,
        limit,
        offset,
        totalPages: Math.ceil(total / limit),
    };
};

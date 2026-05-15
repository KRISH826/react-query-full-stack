import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";

export const getFilteredProductsQuery = async (filters: any, db: Pool | PoolClient = pool) => {
    const { keyword, gender } = filters;
    const conditions: string[] = ["1=1"];
    const values: any[] = [];
    let i = 1;

    if (keyword) {
        conditions.push(`(
    EXISTS (
        SELECT 1
        FROM unnest(string_to_array($${i}, ' ')) AS kw
        WHERE word_similarity(productname, kw) > 0.15
        OR word_similarity(COALESCE(brand, ''), kw) > 0.15
        OR word_similarity(COALESCE(description, ''), kw) > 0.15
    )
    OR productname ILIKE '%' || $${i} || '%'
    OR COALESCE(brand, '') ILIKE '%' || $${i} || '%'
    OR COALESCE(description, '') ILIKE '%' || $${i} || '%'
    OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(categories) c
        WHERE c->>'name' ILIKE '%' || $${i} || '%'
    )
)`);
        values.push(keyword);
        i++;
    }

    if (gender) {
        conditions.push(`gender IN ($${i}::gender_enum, 'UNISEX')`);
        values.push(gender);
        i++;
    }

    const query = `
        WITH filtered_products AS (
            SELECT *
            FROM product_full_mv
            WHERE ${conditions.join(" AND ")}
        )

        SELECT json_build_object(

            'brands', (
                SELECT json_agg(x)
                FROM (
                    SELECT
                        brand AS name,
                        COUNT(*)::int AS count
                    FROM filtered_products
                    WHERE brand IS NOT NULL
                    GROUP BY brand
                    ORDER BY count DESC
                    LIMIT 20
                ) x
            ),

            'categories', (
                SELECT json_agg(x)
                FROM (
                    SELECT
                        c->>'name' AS name,
                        COUNT(*)::int AS count
                    FROM filtered_products,
                    jsonb_array_elements(categories) c
                    GROUP BY c->>'name'
                    ORDER BY count DESC
                ) x
            ),

            'sizes', (
                SELECT json_agg(x)
                FROM (
                    SELECT
                        v->>'size' AS size,
                        COUNT(*)::int AS count
                    FROM filtered_products,
                    jsonb_array_elements(variants) v
                    WHERE v->>'size' IS NOT NULL
                    GROUP BY v->>'size'
                    ORDER BY count DESC
                ) x
            ),

            'ratings', (
                SELECT json_agg(x)
                FROM (
                    SELECT
                        FLOOR(avg_rating)::int AS rating,
                        COUNT(*)::int AS count
                    FROM filtered_products
                    WHERE avg_rating IS NOT NULL
                    GROUP BY FLOOR(avg_rating)
                    ORDER BY rating DESC
                ) x
            ),

            'priceRange', (
                SELECT json_build_object(
                    'min', MIN(
                        COALESCE(
                            (v->>'offer_price_override')::numeric,
                            (v->>'price_override')::numeric
                        )
                    ),

                    'max', MAX(
                        COALESCE(
                            (v->>'offer_price_override')::numeric,
                            (v->>'price_override')::numeric
                        )
                    )
                )
                FROM filtered_products,
                jsonb_array_elements(variants) v
            )

        ) AS filters;
    `;

    const { rows } = await db.query(query, values);
    return rows[0].filters;
}
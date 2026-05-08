import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";

export const getFilteredProductsQuery = async (filters: any, db: Pool | PoolClient = pool) => {
    const { keyword, gender } = filters;
    const conditions: string[] = ["1=1"];
    const values: any[] = [];
    let i = 1;

    if (keyword) {
        conditions.push(`
        (
            productname ILIKE '%' || $${i} || '%'
            OR COALESCE(brand, '') ILIKE '%' || $${i} || '%'
            OR COALESCE(description, '') ILIKE '%' || $${i} || '%'
            OR similarity(productname, $${i}) > 0.2
            OR similarity(COALESCE(brand, ''), $${i}) > 0.2
        )
    `);
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
import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { SearchParams } from "../../models/search";

// Filter options are always based on keyword + gender ONLY
// (same as Amazon — selecting Nike doesn't remove Nike from the brand list)
export const getFilterOptionsQuery = async (
  params: Pick<SearchParams, "keyword" | "gender">,
  db: Pool | PoolClient = pool
) => {
  const { keyword, gender } = params;
  const conditions : string[] = ["1=1"];
  const values     : any[]   = [];
  let   idx        = 1;

  if (keyword) {
    conditions.push(`(
      productname              ILIKE '%' || $${idx} || '%'
      OR COALESCE(description,'') ILIKE '%' || $${idx} || '%'
      OR COALESCE(brand, '')   ILIKE '%' || $${idx} || '%'
    )`);
    values.push(keyword);
    idx++;
  }

  if (gender) {
    conditions.push(`gender IN ($${idx}::gender_enum, 'UNISEX')`);
    values.push(gender);
    idx++;
  }

  // Uses materialized view → fast, no heavy joins
  const query = `
    WITH base AS (
      SELECT * FROM product_full_mv
      WHERE ${conditions.join(" AND ")}
    )
    SELECT json_build_object(

      'brands', (
        SELECT json_agg(x) FROM (
          SELECT brand AS name, COUNT(*)::int AS count
          FROM base
          WHERE brand IS NOT NULL
          GROUP BY brand
          ORDER BY count DESC
          LIMIT 20
        ) x
      ),

      'categories', (
        SELECT json_agg(x) FROM (
          SELECT c->>'name' AS name, COUNT(*)::int AS count
          FROM base, jsonb_array_elements(categories) c
          GROUP BY c->>'name'
          ORDER BY count DESC
        ) x
      ),

      'sizes', (
        SELECT json_agg(x) FROM (
          SELECT v->>'size' AS size, COUNT(*)::int AS count
          FROM base, jsonb_array_elements(variants) v
          WHERE v->>'size' IS NOT NULL
          GROUP BY v->>'size'
          ORDER BY count DESC
        ) x
      ),

      'ratings', (
        SELECT json_agg(x) FROM (
          SELECT FLOOR(avg_rating)::int AS rating, COUNT(*)::int AS count
          FROM base
          WHERE avg_rating IS NOT NULL
          GROUP BY FLOOR(avg_rating)
          ORDER BY rating DESC
        ) x
      ),

      'priceRange', (
        SELECT json_build_object(
          'min', MIN(COALESCE((v->>'offer_price_override')::numeric, (v->>'price_override')::numeric)),
          'max', MAX(COALESCE((v->>'offer_price_override')::numeric, (v->>'price_override')::numeric))
        )
        FROM base, jsonb_array_elements(variants) v
      )

    ) AS options;
  `;

  const { rows } = await db.query(query, values);
  return rows[0].options;
};
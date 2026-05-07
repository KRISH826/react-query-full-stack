import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { SearchParams } from "../../models/search";

export const searchProductsQuery = async (params: SearchParams, db: Pool | PoolClient = pool) => {
    const {
        keyword, gender, brand, size,
        min_price, max_price, rating,
        page = 1, limit = 20
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = ["p.deleted_at IS NULL"];
    const values: any[] = [];
    let idx = 1;
    let scoreSelect = "0 AS score";
    let orderBy = "p.created_at DESC";

    // ── Full-text search ──────────────────────────────────────────────
    if (keyword) {
        scoreSelect = `(
      ts_rank_cd(p.search_vector, websearch_to_tsquery('english', $${idx})) * 0.7 +
      similarity(p.productname, $${idx}) * 0.3
    ) AS score`;

        conditions.push(`(
      p.search_vector @@ websearch_to_tsquery('english', $${idx})
      OR p.productname              ILIKE '%' || $${idx} || '%'
      OR COALESCE(p.brand, '')      ILIKE '%' || $${idx} || '%'
      OR COALESCE(p.description,'') ILIKE '%' || $${idx} || '%'
    )`);

        orderBy = "score DESC, p.created_at DESC";
        values.push(keyword);
        idx++;
    }

    // ── Gender ───────────────────────────────────────────────────────
    if (gender) {
        conditions.push(`p.gender IN ($${idx}::gender_enum, 'UNISEX'::gender_enum)`);
        values.push(gender);
        idx++;
    }

    // ── Brand ────────────────────────────────────────────────────────
    if (brand) {
        conditions.push(`p.brand ILIKE $${idx}`);
        values.push(brand);
        idx++;
    }

    // ── Rating ───────────────────────────────────────────────────────
    if (rating) {
        conditions.push(`p.avg_rating >= $${idx}`);
        values.push(rating);
        idx++;
    }

    // ── Price & Size (one EXISTS = one subquery) ──────────────────────
    if (size || min_price !== undefined || max_price !== undefined) {
        const variantConds: string[] = [];

        if (size) {
            variantConds.push(`v.size = $${idx}`);
            values.push(size);
            idx++;
        }
        if (min_price !== undefined) {
            variantConds.push(`COALESCE(v.offer_price_override, v.price_override) >= $${idx}`);
            values.push(min_price);
            idx++;
        }
        if (max_price !== undefined) {
            variantConds.push(`COALESCE(v.offer_price_override, v.price_override) <= $${idx}`);
            values.push(max_price);
            idx++;
        }

        conditions.push(`EXISTS (
      SELECT 1 FROM product_variants v
      WHERE v.product_id = p.id
        AND ${variantConds.join(" AND ")}
    )`);
    }

    values.push(limit, offset);

    const query = `
    WITH matched AS (
      SELECT p.*, ${scoreSelect}
      FROM products p
      WHERE ${conditions.join(" AND ")}
      ORDER BY ${orderBy}
      LIMIT $${idx} OFFSET $${idx + 1}
    )
    SELECT
      m.*,
      COALESCE(img.images,  '[]'::json) AS images,
      COALESCE(cat.categories, '[]'::json) AS categories,
      COALESCE(var.variants,'[]'::json) AS variants
    FROM matched m

    LEFT JOIN LATERAL (
      SELECT json_agg(jsonb_build_object(
        'id', pi.id, 'image_url', pi.image_url, 'isprimary', pi.isprimary
      )) AS images
      FROM product_images pi
      WHERE pi.product_id = m.id AND pi.isprimary = true
    ) img ON true

    LEFT JOIN LATERAL (
      SELECT json_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'slug', c.slug
      )) AS categories
      FROM product_categories pc
      JOIN categories c ON c.id = pc.category_id
      WHERE pc.product_id = m.id
    ) cat ON true

    LEFT JOIN LATERAL (
      SELECT json_agg(v.*) AS variants
      FROM product_variants v
      WHERE v.product_id = m.id
    ) var ON true

    ORDER BY m.score DESC, m.created_at DESC;
  `;

    const { rows } = await db.query(query, values);
    return rows;
};
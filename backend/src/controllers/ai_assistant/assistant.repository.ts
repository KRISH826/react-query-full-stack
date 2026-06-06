import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { ProductWithImagesDTO } from "../../models/product";
import { ParsedIntentSearch } from "../../models/assistant";

export interface SearchProductsResult {
    data: ProductWithImagesDTO[];
    total: number;
    page: number;
    limit: number;
    offset: number;
    totalPages: number;
}

export const AssistantProductQuery = async (
    intent: ParsedIntentSearch,
    filters: any,
    page: number = 1,
    limit: number = 10,
    db: Pool | PoolClient = pool,
): Promise<SearchProductsResult> => {
    const { keyword, gender, age_group, style, occasion, season, vibe_keywords } = intent;
    const { max_price, brands, categories, sizes } = filters;

    const offset = (page - 1) * limit;
    const conditions: string[] = ["p.deleted_at IS NULL", "p.status = 'active'"];
    const values: any[] = [];
    let i = 1;

    // ── SCORE expression parts (soft ranking) ───────────────────────────────
    const scoreParts: string[] = ["0"];
    let orderClause = "ORDER BY p.created_at DESC";

    // 1. keyword → HARD: product must match on search_vector OR ai_tags
    if (keyword) {
        conditions.push(`(
            -- classic FTS on product name / brand
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
                WHERE word_similarity(kw, p.productname) > 0.15
                   OR word_similarity(kw, p.brand) > 0.15
            )
            -- ai_tags: search_keywords array (Gemini generated)
            OR EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(p.ai_tags->'search_keywords') sk
                WHERE sk ILIKE '%' || $${i} || '%'
            )
            -- ai_tags: image_description (Gemini vision, 200-500 words)
            OR to_tsvector('english', COALESCE(p.ai_tags->>'image_description', ''))
               @@ plainto_tsquery('english', $${i})
        )`);

        // score: keyword relevance
        scoreParts.push(`
            CASE
                WHEN p.search_vector @@ websearch_to_tsquery('english', $${i})
                THEN ts_rank_cd(p.search_vector, websearch_to_tsquery('english', $${i}), 32) + 3.0
                ELSE 0
            END
        `);
        // bonus: search_keywords match
        scoreParts.push(`
            CASE WHEN EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(p.ai_tags->'search_keywords') sk
                WHERE sk ILIKE '%' || $${i} || '%'
            ) THEN 2.0 ELSE 0 END
        `);
        // bonus: image_description FTS match
        scoreParts.push(`
            CASE WHEN to_tsvector('english', COALESCE(p.ai_tags->>'image_description', ''))
                      @@ plainto_tsquery('english', $${i})
            THEN 0.5 ELSE 0 END
        `);

        orderClause = "ORDER BY ai_score DESC, p.created_at DESC";
        values.push(keyword);
        i++;
    }

    // 2. gender → HARD filter
    if (gender && gender !== "UNISEX") {
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

    const hardFilterValues = [...values];

    // style match → score boost
    if (style) {
        scoreParts.push(`CASE WHEN p.ai_tags->>'style' = $${i} THEN 3.0 ELSE 0 END`);
        values.push(style);
        i++;
    }

     // 3. age_group → HARD filter on ai_tags JSONB
    //    Only include products that have ai_tags AND match the age_group
     if (age_group) {
        scoreParts.push(`CASE WHEN p.ai_tags->>'age_group' = $${i} THEN 2.0 ELSE 0 END`);
        values.push(age_group);
        i++;
    }


    // occasion match → score boost
    if (occasion) {
        scoreParts.push(`
            CASE WHEN p.ai_tags->'occasion' @> $${i}::jsonb
            THEN 3.0 ELSE 0 END
        `);
        values.push(JSON.stringify([occasion])); // wrap in array for @> operator
        i++;
    }

   if (season) {
        scoreParts.push(`
            CASE WHEN p.ai_tags->'season' @> $${i}::jsonb
            OR p.ai_tags->'season' @> '["all-season"]'::jsonb THEN 3.0
            WHEN p.ai_tags IS NULL THEN 0
            ELSE 0 END
        `);
        values.push(JSON.stringify([season])); // wrap in array for @> operator
        i++;
    }

    // vibe_keywords → score boost per match
    if (vibe_keywords && vibe_keywords.length > 0) {
        scoreParts.push(`(
            SELECT COALESCE(COUNT(*), 0) * 0.5
            FROM unnest(ARRAY(SELECT jsonb_array_elements_text($${i}::jsonb))) AS vk
            WHERE p.ai_tags->'vibe' ? vk
        )`);
        values.push(JSON.stringify(vibe_keywords));
        i++;
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  EXTRA HARD FILTERS (price, brand, category, size)
    // ═══════════════════════════════════════════════════════════════════════

    // ── COUNT ────────────────────────────────────────────────────────────────
    const countResult = await db.query(
        `SELECT COUNT(*) FROM products p WHERE ${conditions.join(" AND ")}`,
        hardFilterValues,
    );
    const total = Number.parseInt(countResult.rows[0].count, 10);

    // ── MAIN QUERY ────────────────────────────────────────────────────────────
    const scoreExpr = `(${scoreParts.join(" + ")})`;
    const limitPlaceholder = i;
    const offsetPlaceholder = i + 1;

    const query = `
        WITH matched_products AS (
            SELECT p.*, ${scoreExpr} AS ai_score
            FROM products p
            WHERE ${conditions.join(" AND ")}
            ${orderClause}
            LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}
        )
        SELECT
            mp.*,
            COALESCE(img.images,     '[]'::json) AS images,
            COALESCE(cat.categories, '[]'::json) AS categories,
            COALESCE(var.variants,   '[]'::json) AS variants
        FROM matched_products mp

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', pi.id, 'image_url', pi.image_url, 'isprimary', pi.isprimary
            )) AS images
            FROM product_images pi
            WHERE pi.product_id = mp.id AND pi.isprimary = true
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
            FROM product_variants v
            WHERE v.product_id = mp.id
        ) var ON true

        ORDER BY mp.ai_score DESC, mp.created_at DESC;
    `;

    const { rows } = await db.query(query, [...values, limit, offset]);

    return {
        data: rows,
        total,
        page,
        limit,
        offset,
        totalPages: Math.ceil(total / limit),
    };
};
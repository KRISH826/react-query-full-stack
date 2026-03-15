// search.repository.ts
import { pool } from "../../db/db";
import { Gender, ProductWithImagesDTO } from "../../models/product";

interface SearchFilters {
    keyword: string;
    gender?: Gender;
    max_price?: number;
    limit?: number;
}

export const searchProductsQuery = async (
    filters: SearchFilters
): Promise<ProductWithImagesDTO[]> => {
    const { keyword, gender, max_price, limit = 20 } = filters;

    const conditions: string[] = ["p.deleted_at IS NULL"];
    const values: any[] = [];

    values.push(keyword || ""); // $1
    let i = 2;

    if (keyword) {
        values.push(`%${keyword}%`); // $2 ILIKE pattern
        conditions.push(`(
            p.productname % $1
            OR p.brand % $1
            OR p.productname ILIKE $2
            OR p.brand ILIKE $2
            OR EXISTS (
                SELECT 1 FROM product_categories pc2
                JOIN categories c2 ON c2.id = pc2.category_id
                WHERE pc2.product_id = p.id
                AND (c2.name % $1 OR c2.name ILIKE $2)
            )
        )`);
        i++;
    }

    if (gender) {
        conditions.push(`p.gender = $${i}::gender_enum`);
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
        SELECT
            p.*,
            COALESCE(img.images, '[]') AS images,
            COALESCE(cat.categories, '[]') AS categories,
            COALESCE(var.variants, '[]') AS variants,

            -- ✅ Scoring — sirf DB ke stored ai_tags use ho rahe hain
            (
                -- keyword match score
                CASE WHEN $1::text != ''
                    THEN similarity(p.productname, $1::text) * 4
                    ELSE 0
                END

                -- ✅ AI style — keyword se infer karo
                + CASE
                    WHEN $1 ILIKE ANY(ARRAY['%saree%','%lehenga%','%kurta%','%salwar%','%dupatta%'])
                        AND p.ai_tags->>'style' = 'traditional' THEN 3
                    WHEN $1 ILIKE ANY(ARRAY['%suit%','%blazer%','%formal%','%office%'])
                        AND p.ai_tags->>'style' = 'formal' THEN 3
                    WHEN $1 ILIKE ANY(ARRAY['%tshirt%','%t-shirt%','%jeans%','%hoodie%','%casual%'])
                        AND p.ai_tags->>'style' = 'casual' THEN 3
                    WHEN $1 ILIKE ANY(ARRAY['%gym%','%sport%','%track%','%jogger%'])
                        AND p.ai_tags->>'style' = 'sporty' THEN 3
                    WHEN $1 ILIKE ANY(ARRAY['%streetwear%','%oversized%','%urban%'])
                        AND p.ai_tags->>'style' = 'streetwear' THEN 3
                    ELSE 0
                END

                -- ✅ AI gender match
                + CASE
                    WHEN p.ai_tags->>'gender' = 'female'
                        AND p.gender = 'FEMALE' THEN 2
                    WHEN p.ai_tags->>'gender' = 'male'
                        AND p.gender = 'MALE' THEN 2
                    WHEN p.ai_tags->>'gender' = 'unisex' THEN 1
                    ELSE 0
                END

                -- ✅ Vibe match — keyword se
                + CASE
                    WHEN p.ai_tags->'vibe' IS NOT NULL
                        AND EXISTS (
                            SELECT 1 FROM jsonb_array_elements_text(p.ai_tags->'vibe') v
                            WHERE $1 ILIKE '%' || v || '%'
                            OR v ILIKE '%' || $1 || '%'
                        ) THEN 2
                    ELSE 0
                END

                -- ✅ Stock bonus
                + CASE WHEN p.stock_quantity > 0 THEN 1 ELSE 0 END
            ) AS score

        FROM products p

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'alt_text', pi.alt_text,
                'isprimary', pi.isprimary
            )) AS images
            FROM product_images pi
            WHERE pi.product_id = p.id AND pi.isprimary = true
        ) img ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', cat2.id,
                'name', cat2.name,
                'slug', cat2.slug,
                'parent_id', cat2.parent_id
            )) AS categories
            FROM product_categories pc3
            JOIN categories cat2 ON cat2.id = pc3.category_id
            WHERE pc3.product_id = p.id
        ) cat ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(jsonb_build_object(
                'id', v.id,
                'size', v.size,
                'price_override', v.price_override,
                'offer_price_override', v.offer_price_override,
                'stock_quantity', v.stock_quantity,
                'sku', v.sku
            )) AS variants
            FROM product_variants v
            WHERE v.product_id = p.id
        ) var ON true

        WHERE ${conditions.join(" AND ")}
        ORDER BY score DESC
        LIMIT $${i}
    `;

    const { rows } = await pool.query(query, values);
    return rows;
};
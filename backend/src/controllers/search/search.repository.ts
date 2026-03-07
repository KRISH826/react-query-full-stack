import { pool } from "../../db/db";
import { Gender, ProductWithImagesDTO } from "../../models/product";

export const searchProductsQuery = async (
    keyword: string,
    gender?: Gender,
    max_price?: number,
    limit: number = 20
): Promise<ProductWithImagesDTO[]> => {

    const conditions: string[] = ["p.deleted_at IS NULL"];
    const values: any[] = [];
    let i = 1;

    if (keyword) {
        conditions.push(`(
            p.productname % $${i}
            OR p.brand % $${i}
            OR c.name % $${i}
        )`);
        values.push(keyword);
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
            WHERE pv.product_id = p.id AND pv.price_override <= $${i}
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
            CASE WHEN $1::text IS NOT NULL AND $1 != ''
                THEN similarity(p.productname, $1::text)
                ELSE 0
            END AS score
        FROM products p

        LEFT JOIN LATERAL (
            SELECT json_agg(
                jsonb_build_object(
                    'id', pi.id,
                    'image_url', pi.image_url,
                    'alt_text', pi.alt_text,
                    'isprimary', pi.isprimary
                )
            ) AS images
            FROM product_images pi
            WHERE pi.product_id = p.id AND pi.isprimary = true
        ) img ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'slug', c.slug,
                    'parent_id', c.parent_id
                )
            ) AS categories
            FROM product_categories pc
            JOIN categories c ON c.id = pc.category_id
            WHERE pc.product_id = p.id
        ) cat ON true

        LEFT JOIN LATERAL (
            SELECT json_agg(
                jsonb_build_object(
                    'id', v.id,
                    'size', v.size,
                    'price_override', v.price_override,
                    'offer_price_override', v.offer_price_override,
                    'stock_quantity', v.stock_quantity,
                    'sku', v.sku
                )
            ) AS variants
            FROM product_variants v
            WHERE v.product_id = p.id
        ) var ON true

        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id

        WHERE ${conditions.join(" AND ")}
        ORDER BY score DESC
        LIMIT $${i}
    `;

    const { rows } = await pool.query(query, values);
    return rows;
};
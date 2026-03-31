CREATE OR REPLACE VIEW v_product_details AS
SELECT 
    p.*, 
    COALESCE(img.images, '[]'::jsonb) AS images,
    COALESCE(var.variants, '[]'::jsonb) AS variants
FROM products p
LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'alt_text', pi.alt_text,
            'isprimary', pi.isprimary
        ) ORDER BY pi.isprimary DESC, pi.created_at ASC
    ) AS images
    FROM product_images pi WHERE pi.product_id = p.id
) img ON true
LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', v.id,
            'size', v.size,
            'price_override', v.price_override,
            'stock_quantity', v.stock_quantity,
            'sku', v.sku
        ) ORDER BY v.created_at ASC
    ) AS variants
    FROM product_variants v WHERE v.product_id = p.id
) var ON true;
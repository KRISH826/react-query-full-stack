CREATE OR REPLACE VIEW v_product_details AS
SELECT 
    p.id, p.productname, p.description, p.gender,
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

DROP VIEW v_product_details;


CREATE MATERIALIZED VIEW product_full_mv AS
SELECT 
    p.id, p.productname,p.description,p.gender,p.brand, p.avg_rating, p.total_reviews,
	p.status, p.stock_quantity, p.is_track_inventory, p.created_at, p.updated_at,
    COALESCE(img.images, '[]') AS images,
    COALESCE(cat.categories, '[]') AS categories,
    COALESCE(var.variants, '[]') AS variants
FROM products p

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'alt_text', pi.alt_text,
            'isprimary', pi.isprimary
        )
        ORDER BY pi.isprimary DESC, pi.created_at ASC
    ) AS images
    FROM product_images pi
    WHERE pi.product_id = p.id
) img ON true

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
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
    SELECT jsonb_agg(
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

WHERE p.deleted_at IS NULL;

SELECT * from products
CREATE INDEX idx_product_mv_created_at ON product_full_mv (created_at DESC);
CREATE INDEX idx_product_mv_id ON product_full_mv (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY product_full_mv;
CREATE UNIQUE INDEX idx_product_mv_unique_id ON product_full_mv (id);



-- product with imageDto
CREATE MATERIALIZED VIEW product_detail_mv AS
SELECT 
    p.*,
    COALESCE(img.images, '[]') AS images,
    COALESCE(cat.categories, '[]') AS categories,
    COALESCE(var.variants, '[]') AS variants

FROM products p

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'alt_text', pi.alt_text,
            'isprimary', pi.isprimary
        )
        ORDER BY pi.isprimary DESC, pi.created_at ASC
    ) AS images
    FROM product_images pi
    WHERE pi.product_id = p.id
) img ON true

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'parent_id', c.parent_id
        )
        ORDER BY c.name ASC
    ) AS categories
    FROM product_categories pc
    JOIN categories c ON c.id = pc.category_id
    WHERE pc.product_id = p.id
) cat ON true

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', v.id,
            'size', v.size,
            'price_override', v.price_override,
            'offer_price_override', v.offer_price_override,
            'stock_quantity', v.stock_quantity,
            'sku', v.sku
        )
        ORDER BY v.created_at ASC
    ) AS variants
    FROM product_variants v
    WHERE v.product_id = p.id
) var ON true

WHERE p.deleted_at IS NULL;

CREATE UNIQUE INDEX idx_product_detail_mv_id ON product_detail_mv (id);

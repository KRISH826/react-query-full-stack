DROP INDEX idx_variant_price;
CREATE INDEX idx_variants_effective_price 
ON product_variants (
    product_id,
    COALESCE(offer_price_override, price_override)
);
CREATE INDEX idx_products_active 
ON products (created_at DESC)
WHERE deleted_at IS NULL;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
select * from order_items

CREATE OR REPLACE VIEW orders_with_items AS
SELECT 
    o.*,
    COALESCE(items.items, '[]') AS items
FROM orders o
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'id',                       oi.id,
            'order_id',                 oi.order_id,
            'product_id',               oi.product_id,
            'variant_id',               oi.variant_id,
            'product_name',             oi.product_name,
            'product_brand',            oi.product_brand,
            'quantity',                 oi.quantity,
            'price_at_purchase',        oi.price_at_purchase,
            'offer_price_at_purchase',  oi.offer_price_at_purchase,
            'subtotal',                 oi.subtotal,
            'size',                     oi.size,
            'status',                   oi.status,
            'image_url',                oi.image_url,
            'created_at',               oi.created_at
        ) ORDER BY oi.created_at ASC
    ) AS items
    FROM order_items oi
    WHERE oi.order_id = o.id
) items ON true
WHERE o.deleted_at IS NULL;
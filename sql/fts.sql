-- Step 2: Purane products ka search_vector rebuild karo (ai_tags include karke)

select * from public.products WHERE productname='Embroidered Mandarin Collar Kurta & Trousers'
UPDATE products
SET search_vector = to_tsvector('english',
    COALESCE(productname, '')  || ' ' ||
    COALESCE(description, '')  || ' ' ||
    COALESCE(brand, '')        || ' ' ||

    COALESCE((
        SELECT string_agg(val, ' ')
        FROM jsonb_array_elements_text(ai_tags->'occasion') val
        WHERE jsonb_typeof(ai_tags->'occasion') = 'array'
    ), '') || ' ' ||

    COALESCE(ai_tags->>'style', '')    || ' ' ||
    COALESCE(ai_tags->>'fit', '')      || ' ' ||
    COALESCE(ai_tags->>'pattern', '')  || ' ' ||

    COALESCE((
        SELECT string_agg(val, ' ')
        FROM jsonb_array_elements_text(ai_tags->'season') val
        WHERE jsonb_typeof(ai_tags->'season') = 'array'
    ), '') || ' ' ||

    COALESCE((
        SELECT string_agg(val, ' ')
        FROM jsonb_array_elements_text(ai_tags->'search_keywords') val
        WHERE jsonb_typeof(ai_tags->'search_keywords') = 'array'
    ), '') || ' ' ||

    COALESCE((
        SELECT string_agg(val, ' ')
        FROM jsonb_array_elements_text(ai_tags->'vibe') val
        WHERE jsonb_typeof(ai_tags->'vibe') = 'array'
    ), '')
);

Step 4: Trigger function
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.productname, '')  || ' ' ||
        COALESCE(NEW.description, '')  || ' ' ||
        COALESCE(NEW.brand, '')        || ' ' ||
        COALESCE(NEW.ai_tags->>'style', '')    || ' ' ||
        COALESCE(NEW.ai_tags->>'fit', '')      || ' ' ||
        COALESCE(NEW.ai_tags->>'pattern', '')  || ' ' ||

        -- occasion (array)
        COALESCE((
            SELECT string_agg(val, ' ')
            FROM jsonb_array_elements_text(NEW.ai_tags->'occasion') val
            WHERE jsonb_typeof(NEW.ai_tags->'occasion') = 'array'
        ), '') || ' ' ||

        -- season (array)
        COALESCE((
            SELECT string_agg(val, ' ')
            FROM jsonb_array_elements_text(NEW.ai_tags->'season') val
            WHERE jsonb_typeof(NEW.ai_tags->'season') = 'array'
        ), '') || ' ' ||

        -- search_keywords (array)
        COALESCE((
            SELECT string_agg(val, ' ')
            FROM jsonb_array_elements_text(NEW.ai_tags->'search_keywords') val
            WHERE jsonb_typeof(NEW.ai_tags->'search_keywords') = 'array'
        ), '') || ' ' ||

        -- vibe (array)
        COALESCE((
            SELECT string_agg(val, ' ')
            FROM jsonb_array_elements_text(NEW.ai_tags->'vibe') val
            WHERE jsonb_typeof(NEW.ai_tags->'vibe') = 'array'
        ), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

select * from public.favourite_products


SELECT productname
FROM products
WHERE search_vector @@ to_tsquery('english', 'wed | dress');

CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT 
    word_similarity('abibas', 'adidas'),
    word_similarity('decothlon', 'decathlon'),
    word_similarity('nke', 'nike');

	CREATE INDEX idx_products_ai_image_description 
ON products USING gin (to_tsvector('english', COALESCE(ai_tags->>'image_description', '')));

CREATE TYPE gender AS ENUM ('male', 'female', 'unisex');

select * from users

ALTER TABLE users
ADD COLUMN state VARCHAR(30);

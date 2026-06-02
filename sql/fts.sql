-- Step 2: Purane products ka search_vector rebuild karo (ai_tags include karke)

select * from public.products
UPDATE products
SET search_vector = to_tsvector('english',
    COALESCE(productname, '')                    || ' ' ||
    COALESCE(description, '')                    || ' ' ||
    COALESCE(brand, '')                          || ' ' ||
    COALESCE(ai_tags->>'occasion', '')           || ' ' ||
    COALESCE(ai_tags->>'style', '')              || ' ' ||
    COALESCE(ai_tags->>'fit', '')                || ' ' ||
    COALESCE(ai_tags->>'pattern', '')            || ' ' ||
    COALESCE(ai_tags->>'season', '')             || ' ' ||
    COALESCE((
        SELECT string_agg(val, ' ')
        FROM jsonb_array_elements_text(COALESCE(ai_tags->'search_keywords', '[]'::jsonb)) val
    ), '') || ' ' ||
    COALESCE((
        SELECT string_agg(val, ' ')
        FROM jsonb_array_elements_text(COALESCE(ai_tags->'vibe', '[]'::jsonb)) val
    ), '')
);

Step 4: Trigger function
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.productname, '')                    || ' ' ||
        COALESCE(NEW.description, '')                    || ' ' ||
        COALESCE(NEW.brand, '')                          || ' ' ||
        COALESCE(NEW.ai_tags->>'occasion', '')           || ' ' ||
        COALESCE(NEW.ai_tags->>'style', '')              || ' ' ||
        COALESCE(NEW.ai_tags->>'fit', '')                || ' ' ||
        COALESCE(NEW.ai_tags->>'pattern', '')            || ' ' ||
        COALESCE(NEW.ai_tags->>'season', '')             || ' ' ||
        COALESCE((
            SELECT string_agg(val, ' ')
            FROM jsonb_array_elements_text(COALESCE(NEW.ai_tags->'search_keywords', '[]'::jsonb)) val
        ), '') || ' ' ||
        COALESCE((
            SELECT string_agg(val, ' ')
            FROM jsonb_array_elements_text(COALESCE(NEW.ai_tags->'vibe', '[]'::jsonb)) val
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

	

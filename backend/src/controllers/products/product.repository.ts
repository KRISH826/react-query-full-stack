import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateProductDTO, CreateVariantDTO, ProductDB, ProductImageDB, ProductImageDTO, ProductWithImagesDTO, UpdateProductDTO } from "../../models/product";

export async function findProductByid(productname: string, db: Pool | PoolClient = pool): Promise<ProductDB | null> {
    const { rows } = await db.query(
        "SELECT * FROM products WHERE productname = $1",
        [productname]
    );
    return rows[0] || null;
}

export async function findById(id: string, db: Pool | PoolClient = pool): Promise<ProductDB | null> {
    const { rows } = await db.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );
    return rows[0] || null;
}

export async function createProduct(product: CreateProductDTO, db: Pool | PoolClient = pool): Promise<ProductDB> {
    const { rows } = await db.query(
        `INSERT INTO products (productname, description, brand, stock_quantity, is_track_inventory, status, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            product.productname,
            product.description,
            product.brand ?? null,
            product.stock_quantity ?? 0,
            product.is_track_inventory ?? true,
            product.status,
            product.created_by ?? null,
        ]
    );
    return rows[0];
}

export async function addProductImage(image: ProductImageDTO, db: Pool | PoolClient = pool): Promise<ProductImageDB> {
    const { rows } = await db.query(
        `INSERT INTO product_images (product_id, image_url, isprimary) 
         VALUES ($1, $2, $3) RETURNING *`,
        [
            image.product_id,
            image.image_url,
            image.isprimary,
        ]
    );
    return rows[0];
}

export async function updateProduct(id: string, product: UpdateProductDTO, db: Pool | PoolClient = pool): Promise<ProductDB | null> {
    const { rows } = await db.query(
        `UPDATE products 
         SET productname=$1, description=$2, brand=$3, stock_quantity=$4, is_track_inventory=$5, status=$6
         WHERE id=$7 RETURNING *`,
        [
            product.productname,
            product.description,
            product.brand ?? null,
            product.stock_quantity,
            product.is_track_inventory,
            product.status,
            id,
        ]
    );
    return rows[0] || null;
}

export async function deleteProductImages(productId: string, db: Pool | PoolClient = pool): Promise<void> {
    await db.query(
        `DELETE FROM product_images WHERE product_id = $1`,
        [productId]
    );
}

export async function findProductById(id: string, db: Pool | PoolClient = pool): Promise<ProductDB | null> {
    const { rows } = await db.query(
        `SELECT * FROM products WHERE id=$1`,
        [id]
    );
    return rows[0] || null;
}

export async function deleteProduct(id: string, db: Pool | PoolClient = pool): Promise<ProductDB | null> {
    const { rows } = await db.query(
        `UPDATE products SET deleted_at=NOW() WHERE id=$1 AND deleted_at IS NULL RETURNING *`,
        [id]
    );
    return rows[0] || null;
}

export async function findAllProducts(
    page: number = 1,
    limit: number = 10
): Promise<{ data: ProductWithImagesDTO[], total: number }> {
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM products WHERE deleted_at IS NULL`
    );
    const total = parseInt(countResult.rows[0].count);

    const { rows } = await pool.query(`
        SELECT 
            p.*,
            COALESCE(img.images, '[]') AS images,
            COALESCE(cat.categories, '[]') AS categories,
            COALESCE(var.variants, '[]') AS variants
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
            WHERE pi.product_id = p.id
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

        WHERE p.deleted_at IS NULL
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return { data: rows, total };
}

export async function findProductWithImagesById(id: string, db: Pool | PoolClient = pool): Promise<ProductWithImagesDTO | null> {
    const { rows } = await db.query(`
        SELECT 
            p.*,
            COALESCE(img.images, '[]') AS images,
            COALESCE(cat.categories, '[]') AS categories,
            COALESCE(var.variants, '[]') AS variants
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
            WHERE pi.product_id = p.id
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

        WHERE p.deleted_at IS NULL
        AND p.id = $1
    `, [id]);

    return rows[0] || null;
}

export async function deleteProductCategories(productId: string, db: Pool | PoolClient = pool): Promise<void> {
    await db.query(
        `DELETE FROM product_categories WHERE product_id = $1`,
        [productId]
    );
}

export async function addProductVariant(variant: CreateVariantDTO, db: Pool | PoolClient = pool): Promise<void> {
    await db.query(`
        INSERT INTO product_variants (product_id, size, price_override, offer_price_override, stock_quantity, sku)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [
        variant.product_id,
        variant.size ?? null,
        variant.price_override,
        variant.offer_price_override ?? null,
        variant.stock_quantity,
        variant.sku ?? null
    ]);
}

export async function deleteProductVariants(productId: string, db: Pool | PoolClient = pool): Promise<void> {
    await db.query(
        `DELETE FROM product_variants WHERE product_id = $1`,
        [productId]
    );
}
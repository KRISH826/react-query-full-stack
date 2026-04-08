import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CategoryDb, CategoryResponseDTO, ProductCategoryDB } from "../../models/category";
import { generateSlug } from "../../helper/helper";
import { ProductResponseDTO } from "../../models/product";

export async function findCategoryById(id: string, db: Pool | PoolClient = pool): Promise<CategoryDb | null> {
    const { rows } = await db.query(
        `SELECT * FROM categories WHERE id=$1`,
        [id]
    )
    return rows[0] || null;
}

export async function findCategoryByName(name: string, db: Pool | PoolClient = pool): Promise<CategoryDb | null> {
    const { rows } = await db.query(
        `SELECT * FROM categories WHERE name=$1`,
        [name]
    )
    return rows[0] || null;
}

export async function findCategoryBySlug(slug: string, db: Pool | PoolClient = pool): Promise<CategoryDb | null> {
    const { rows } = await db.query(
        `SELECT * FROM categories WHERE slug=$1`,
        [slug]
    )
    return rows[0] || null;
}

export async function createCateGory(data: CategoryResponseDTO, db: Pool | PoolClient = pool): Promise<CategoryDb> {
    const { rows } = await db.query(
        `INSERT INTO categories (name, slug, is_parent, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [data.name, data.slug = generateSlug(data.name), data.is_parent, data.parent_id || null]
    )
    return rows[0];
}

export async function updateCategory(id: string, data: CategoryResponseDTO, db: Pool | PoolClient = pool) {
    const { rows } = await db.query(
        `UPDATE categories SET name=$1, slug=$2, is_parent=$3, parent_id=$4 WHERE id=$5 RETURNING *`,
        [data.name, data.slug = generateSlug(data.name), data.is_parent, data.parent_id || null, id]
    )
    return rows[0] || null;
}

export async function deleteCategory(id: string, db: Pool | PoolClient = pool) {
    const { rows } = await db.query(
        `DELETE FROM categories WHERE id=$1 RETURNING *`,
        [id]
    )
    return rows[0] || null;
}

export async function getAllCategories(db: Pool | PoolClient = pool) {
    const { rows } = await db.query(
        `SELECT * FROM categories ORDER BY created_at DESC`
    )
    return rows;
}

export async function addProductCategory(productId: string, categoryId: string, db: Pool | PoolClient = pool): Promise<ProductCategoryDB> {
    const { rows } = await db.query(
        `INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2) RETURNING *`,
        [productId, categoryId]
    )
    return rows[0];
}

export async function deleteProductCategory(productId: string, categoryId: string, db: Pool | PoolClient = pool): Promise<ProductCategoryDB> {
    const { rows } = await db.query(
        `DELETE FROM product_categories WHERE product_id=$1 AND category_id=$2 RETURNING *`,
        [productId, categoryId]
    )
    return rows[0];
}

export async function getCategoriesForProduct(productId: string, db: Pool | PoolClient = pool): Promise<CategoryDb[]> {
    const { rows } = await db.query(
        `SELECT c.* FROM categories c
         INNER JOIN product_categories pc ON c.id = pc.category_id
         WHERE pc.product_id = $1`,
        [productId]
    );
    return rows;
}


export async function getProductByCategoryId(slug: string, categoryId: string, page: number = 1,
    limit: number = 30, db: Pool | PoolClient = pool): Promise<{ data: ProductResponseDTO[], total: number }> {
    const offset = (page - 1) * limit;

    const countResult = db.query(
        `SELECT COUNT(*)
         FROM product_categories pc
         INNER JOIN categories c ON c.id = pc.category_id
         WHERE pc.category_id = $1 AND c.slug = $2`,
        [categoryId, slug]
    );

    const total = parseInt((await countResult).rows[0].count, 10);

    const query = await db.query(
        `SELECT p.id, p.productname, p.description, p.brand,p.total_reviews, p.avg_rating,
        COALESCE(img.images, '[]'::json) AS images,
        COALESCE(cat.categories, '[]'::json) AS categories,
        COALESCE(var.variants, '[]'::json) AS variants
    FROM product_categories pc
    INNER JOIN categories c_filter ON c_filter.id = pc.category_id
    INNER JOIN products p ON pc.product_id = p.id
    LEFT JOIN LATERAL (
        SELECT json_agg(
            json_build_object(
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
        SELECT json_agg(
            json_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'parent_id', c.parent_id
            )
            ORDER BY c.created_at ASC
        ) AS categories
        FROM categories c
        WHERE c.id = pc.category_id
    ) cat ON true                              -- ✅ was missing entirely
    LEFT JOIN LATERAL (
        SELECT json_agg(
            json_build_object(
                'id', v.id,
                'size', v.size,
                'price_override', v.price_override,
                'offer_price_override', v.offer_price_override,
                'sku', v.sku,
                'stock_quantity', v.stock_quantity
            )
            ORDER BY v.created_at ASC
        ) AS variants
        FROM product_variants v
        WHERE v.product_id = p.id
    ) var ON true                              -- ✅ was completely absent
    WHERE pc.category_id = $1                 -- ✅ was missing, $1 was never bound
      AND c_filter.slug = $2
    LIMIT $3 OFFSET $4`,
        [categoryId, slug, limit, offset]
    );

    return { data: query.rows, total };
}

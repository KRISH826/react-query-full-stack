import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CategoryDb, CategoryResponseDTO, ProductCategoryDB } from "../../models/category";

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
        `INSERT INTO categories (name, slug, parent_id) VALUES ($1, $2, $3) RETURNING *`,
        [data.name, data.slug = data.name.toLowerCase(), data.parent_id || null]
    )
    return rows[0];
}

export async function updateCategory(id: string, data: CategoryResponseDTO, db: Pool | PoolClient = pool) {
    const { rows } = await db.query(
        `UPDATE categories SET name=$1, slug=$2, parent_id=$3 WHERE id=$4 RETURNING *`,
        [data.name, data.slug = data.name.toLowerCase(), data.parent_id || null, id]
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


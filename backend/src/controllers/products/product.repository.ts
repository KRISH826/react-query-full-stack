import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateProductDTO, CreateVariantDTO, ProductDB, ProductImageDB, ProductImageDTO, ProductWithImagesDTO, ProductWithImagesResponseDTO, UpdateProductDTO } from "../../models/product";
import { ProductAITags } from "../../models/aimodel";
import { OrderItemDB } from "../../models/order";

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
        `INSERT INTO products (productname, description, brand, ai_tags, gender, stock_quantity, is_track_inventory, status, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
            product.productname,
            product.description,
            product.brand ?? null,
            product.ai_tags ?? null,
            product.gender,
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
         SET productname=$1, description=$2, brand=$3, gender=$4, stock_quantity=$5, is_track_inventory=$6, status=$7
         WHERE id=$8 RETURNING *`,
        [
            product.productname,
            product.description,
            product.brand ?? null,
            product.gender,
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

    const { rows } = await pool.query(`
        SELECT *
        FROM product_full_mv
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM products WHERE deleted_at IS NULL`
    );
    const total = parseInt(countResult.rows[0].count);
    return { data: rows, total };
}

export async function findProductWithImagesById(id: string, db: Pool | PoolClient = pool): Promise<ProductWithImagesDTO | null> {
    const { rows } = await db.query(
        `SELECT * FROM product_detail_mv WHERE id=$1`,
        [id]
    )

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

export async function saveProductAITags(
    productId: string,
    tags: ProductAITags,
    client: PoolClient
) {
    await client.query(
        `UPDATE products SET ai_tags = $1 WHERE id = $2`,
        [JSON.stringify(tags), productId]
    );
}

export async function topProducts(
    limit: number = 15,
    db: Pool | PoolClient = pool
): Promise<ProductWithImagesDTO[]> {

    const { rows } = await db.query(`
        SELECT 
            v.*,
            oc.order_count
        FROM v_product_details v
        JOIN (
            SELECT 
                product_id, 
                COUNT(*) AS order_count
            FROM order_items
            GROUP BY product_id
        ) oc ON oc.product_id = v.id
        ORDER BY oc.order_count DESC
        LIMIT $1;
    `, [limit]);

    return rows;
}


export async function refreshProductFullMV(db: Pool | PoolClient = pool): Promise<void> {
    await db.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY product_full_mv`);
}

export async function refreshProductDetailMV(db: Pool | PoolClient = pool): Promise<void> {
    await db.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY product_detail_mv`);
}


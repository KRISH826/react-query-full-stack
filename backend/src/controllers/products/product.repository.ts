import { pool } from "../../db/db";
import { OrderDB, OrderResponseDTO } from "../../models/order";
import { CreateProductDTO, ProductDB, ProductImageDB, ProductImageDTO, ProductWithImagesDTO, ProductWithImagesResponseDTO, UpdateProductDTO } from "../../models/product";

export async function findProductByid(productname: string): Promise<ProductDB | null> {
    const { rows } = await pool.query(
        "SELECT * FROM products WHERE productname = $1",
        [productname]
    );
    return rows[0] || null;
}

export async function findById(id: string): Promise<ProductDB | null> {
    const { rows } = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );
    return rows[0] || null;
}

export async function createProduct(product: CreateProductDTO): Promise<ProductDB> {
    const { rows } = await pool.query(
        `INSERT INTO products (productname, description, price, brand, stock_quantity, is_track_inventory, status, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
            product.productname,
            product.description,
            product.price,
            product.brand,
            product.stock_quantity,
            product.is_track_inventory,
            product.status,
            product.created_by,
        ]
    );
    return rows[0];
}

export async function addProductImage(image: ProductImageDTO): Promise<ProductImageDB> {
    const { rows } = await pool.query(
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


export async function updateProduct(id: string, product: UpdateProductDTO): Promise<ProductDB | null> {
    const { rows } = await pool.query(
        `UPDATE products SET productname=$1, description=$2, price=$3, brand=$4, stock_quantity=$5, is_track_inventory=$6, status=$7 WHERE id=$8 RETURNING *`,
        [
            product.productname,
            product.description,
            product.price,
            product.brand,
            product.stock_quantity,
            product.is_track_inventory,
            product.status,
            id,
        ]
    );
    return rows[0] || null;
}

export async function updateProductImage(id: string, image: ProductImageDTO): Promise<ProductImageDB | null> {
    const { rows } = await pool.query(
        `UPDATE product_images SET product_id=$1, image_url=$2, isprimary=$3 WHERE id=$4 RETURNING *`,
        [
            image.product_id,
            image.image_url,
            image.isprimary,
            id,
        ]
    );
    return rows[0] || null;
}

export async function deleteProductImages(productId: string): Promise<void> {
    await pool.query(
        `DELETE FROM product_images WHERE product_id = $1`,
        [productId]
    );
}

export async function findProductById(id: string): Promise<ProductDB | null> {
    const { rows } = await pool.query(
        `SELECT * FROM products WHERE id=$1`,
        [id]
    );
    return rows[0] || null;
}

export async function deleteProduct(id: string): Promise<ProductDB | null> {
    const { rows } = await pool.query(
        `UPDATE products SET deleted_at=NOW() WHERE id=$1 AND deleted_at IS NULL RETURNING *`,
        [id]
    );
    return rows[0] || null;
}

export async function findAllProducts(): Promise<ProductWithImagesDTO[] | null> {
    const { rows } = await pool.query(`
        SELECT 
            p.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', pi.id,
                        'image_url', pi.image_url,
                        'alt_text', pi.alt_text,
                        'isprimary', pi.isprimary
                    )
                    ORDER BY pi.isprimary DESC, pi.created_at ASC
                ) FILTER (WHERE pi.id IS NOT NULL),
                '[]'
            ) AS images
        FROM products p
        LEFT JOIN product_images pi ON pi.product_id = p.id
        WHERE p.deleted_at IS NULL
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `);
    return rows as ProductWithImagesDTO[] || null;
}


export async function findProductWithImagesById(id: string): Promise<ProductWithImagesDTO | null> {
    const { rows } = await pool.query(`
        SELECT 
            p.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', pi.id,
                        'image_url', pi.image_url,
                        'alt_text', pi.alt_text,
                        'isprimary', pi.isprimary
                    )
                    ORDER BY pi.isprimary DESC, pi.created_at ASC
                ) FILTER (WHERE pi.id IS NOT NULL),
                '[]'
            ) AS images
        FROM products p
        LEFT JOIN product_images pi ON pi.product_id = p.id
        WHERE p.deleted_at IS NULL AND p.id = $1
        GROUP BY p.id
    `, [id]);
    return rows[0] || null;
}



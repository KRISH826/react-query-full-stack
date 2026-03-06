import { pool } from "../../db/db";
import { Gender, ProductWithImagesDTO } from "../../models/product";

export const searchProductsQuery = async (
    keyword: string,
    gender?: Gender,
    max_price?: number,
    limit: number = 20
): Promise<ProductWithImagesDTO[]> => {

    const conditions: string[] = ["p.deleted_at IS NULL"];
    const values: any[] = [];
    let i = 1;

    if (keyword) {
        conditions.push(`(
      p.productname % $${i}
      OR p.brand % $${i}
      OR c.name % $${i}
    )`);
        values.push(keyword);
        i++;
    }

    if (gender) {
        conditions.push(`p.gender = $${i}::gender_enum`);
        values.push(gender);
        i++;
    }

    if (max_price) {
        conditions.push(`p.max_price <= $${i}`);
        values.push(max_price);
        i++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    values.push(limit);

    const query = `
    SELECT DISTINCT p.*, similarity(p.productname, $1) AS score
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    ${whereClause}
    ORDER BY score DESC
    LIMIT $${i}
`;

    const { rows } = await pool.query(query, values);
    return rows;
};
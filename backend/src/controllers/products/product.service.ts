import { HttpError } from "../../middlewares/error.middleware";
import { CreateProductDTO, ProductDB, UpdateProductDTO } from "../../models/product";
import { createProduct, deleteProduct, findAllProducts, findById, findProductById, findProductByid, updateProduct } from "./product.repository";

export class ProductService {
    static async createProductService(product: CreateProductDTO): Promise<ProductDB> {
        const existingProduct = await findProductByid(product.productname);
        if (!product.productname || !product.description || !product.price || !product.brand || !product.stock_quantity || !product.status) {
            throw new HttpError("All fields are required", 400);
        }
        if (existingProduct) {
            throw new HttpError("Product already exists", 409);
        }
        return await createProduct(product);
    }

    static async findByProductIdService(id: string): Promise<ProductDB | null> {
        const existingProduct = await findProductById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        return existingProduct;
    }

    static async updateProductService(id: string, product: UpdateProductDTO): Promise<ProductDB | null> {
        const existingProduct = await findById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        return await updateProduct(id, product);
    }

    static async deleteProductService(id: string): Promise<ProductDB | null> {
        const existingProduct = await findById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        return await deleteProduct(id);
    }

    static async findAllProductsService(): Promise<ProductDB[] | null> {
        return await findAllProducts();
    }
}
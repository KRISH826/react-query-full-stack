import { ProductStatus, ProductVariant } from "./product";

export interface FavouriteItem {
    product_id: string;
    product: FavouriteProduct;
}

export interface FavouriteProduct {
    id: string;
    productname: string;
    description: string;
    status: ProductStatus;
    brand?: string | null;
    variants: ProductVariant[];
    primary_image: string;
}
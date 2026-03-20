export enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "out_of_stock",
    ARCHIVED = "archived",
}

export interface ProductVariant {
    id: string;
    product_id: string;
    size: string | null;
    price_override?: number;
    offer_price_override?: number;
    sku: string | null;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
}

export interface CreateVariantPayload {
    product_id?: string;
    size?: string;
    price_override?: number;
    offer_price_override?: number;
    stock_quantity: number;
    sku?: string | null;
}

export interface Product {
    id: string;
    productname: string;
    description: string;
    status: ProductStatus;
    brand?: string | null;
    stock_quantity: number;
    is_track_inventory: boolean;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    avg_rating?: number;
    total_reviews?: number;
    images?: ProductImage[];
    categories?: Category[];
    variants?: ProductVariant[];
}

export interface ProductPayload {
    productname: string;
    description: string;
    brand?: string;
    stock_quantity?: number;
    is_track_inventory?: boolean;
    status?: ProductStatus;
    category_names?: string[];
    variants?: CreateVariantPayload[];
}

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    alt_text?: string | null;
    isprimary: boolean;
    created_at: string;
}

export interface ProductQuery {
    search?: string;
    status?: ProductStatus;
    min_price?: number;
    max_price?: number;
    brand?: string;
    category_id?: string;
    in_stock?: boolean;
    page?: number;
    limit?: number;
    sortBy?: "price" | "created_at";
    sortOrder?: "asc" | "desc";
}

// Category Models

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id?: string | null;
    created_at?: string; // Optional if not always needed
}

export interface CategoryPayload {
    name: string;
    slug: string;
    parent_id?: string | null;
}
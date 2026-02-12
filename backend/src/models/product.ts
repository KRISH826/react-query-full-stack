export enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "out_of_stock",
    ARCHIVED = "archived",
}
export interface ProductDB {
    id: string;
    productname: string;
    description: string;
    price: number;
    status: ProductStatus;
    brand?: string | null;
    stock_quantity: number;
    is_track_inventory: boolean;
    created_by?: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
}

export interface CreateProductDTO {
    productname: string;
    description: string;
    price: number;
    brand?: string;
    stock_quantity?: number;
    is_track_inventory?: boolean;
    created_by?: string;
    status?: ProductStatus; // admin only
    category_names?: string[]; // ADD THIS
}

export interface UpdateProductDTO {
    productname?: string;
    description?: string;
    price?: number;
    brand?: string;
    stock_quantity?: number;
    is_track_inventory?: boolean;
    status?: ProductStatus;
    category_names?: string[]; // ADD THIS
}

export interface ProductResponseDTO {
    id: string;
    productname: string;
    description: string;
    price: number;
    status: ProductStatus;
    brand?: string | null;
    stock_quantity: number;
    is_track_inventory: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ProductImageDB {
    id: string;
    product_id: string;
    image_url: string;
    alt_text?: string | null;
    isprimary: boolean;
    created_at: Date;
}

export interface ProductImageDTO {
    product_id: string;
    image_url: string;
    isprimary: boolean;
}

export interface ProductCategoryDB {
    id: string;
    product_id: string;
    category_id: string;
    created_at: Date;
}

export interface CategoryDB {
    id: string;
    name: string;
    slug?: string | null;
    parent_id?: string | null;
    created_at: Date;
}

export interface CategoryDTO {
    name: string;
    slug?: string | null;
    parent_id?: string | null;
}

export interface ProductCategoryDTO {
    product_id: string;
    category_id: string;
}

export interface ProductQueryDTO {
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

// 
export interface ProductWithImagesDTO extends ProductDB {
    images: ProductImageDB[];
}

export interface ProductWithImagesResponseDTO extends ProductResponseDTO {
    image_url: string;
    categories: CategoryDTO[];
}
// Base category type representing the response from the API
export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    is_parent: boolean;
    created_at?: string;
    children?: Category[];
}

export interface CategoryCreatePayload {
    name: string;
    is_parent: boolean;
    slug: string;
    parent_id?: string | null;
}
export interface CategoryUpdatePayload {
    name?: string;
    is_parent?: boolean;
    slug?: string;
    parent_id?: string | null;
}

export interface ProductCategory {
    product_id: string;
    category_id: string;
}

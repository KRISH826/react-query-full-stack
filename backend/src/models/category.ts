export interface CategoryDb {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
    is_parent: boolean;
    created_at: Date;
}

export interface CategoryDTO {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
}

export interface CategoryResponseDTO {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
    is_parent: boolean;
}

export interface CategoryCreateDTO {
    name: string;
    slug: string;
    parent_id: string;
    is_parent: boolean;
}

export interface CategoryUpdateDTO {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
    is_parent: boolean;
}

export interface ProductCategoryDB {
    product_id: string;
    category_id: string;
}

export interface ProductCategoryDTO {
    product_id: string;
    category_id: string;
}

export interface ProductCategoryResponseDTO {
    product_id: string;
    category_id: string;
}
export interface CategoryTree {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    is_parent: boolean;
    children: CategoryTree[];
}
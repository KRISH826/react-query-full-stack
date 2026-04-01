export interface CategoryDb {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
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
}

export interface CategoryCreateDTO {
    name: string;
    slug: string;
    parent_id: string;
}

export interface CategoryUpdateDTO {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
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
    children: CategoryTree[];
}
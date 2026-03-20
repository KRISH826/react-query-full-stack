import { CategoryTree } from "../models/category";
import { CategoryDB } from "../models/product";

export function generateSlug(name: string) {
    return name
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
}

export function buildCategoryTree(categories: CategoryDB[]): CategoryTree[] {
    const categoryMap: Record<string, CategoryTree> = {};
    const roots: CategoryTree[] = [];

    for(const category of categories) {
        categoryMap[category.id] = {
            id: category.id,
            name: category.name,
            slug: generateSlug(category.name),
            parent_id: category.parent_id || null,
            children: []
        }
    }

    for(const category of categories) {
        if(category.parent_id) {
            const parent = categoryMap[category.parent_id];
            if(parent) {
                parent.children.push(categoryMap[category.id]);
            }
        } else {
            roots.push(categoryMap[category.id]);
        }
    }

    return roots;
}
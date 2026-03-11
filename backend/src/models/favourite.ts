import { ProductWithImagesDTO } from "./product";

export interface FavouritesDB {
    id: string;
    user_id: string;
    product_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface addFavouriteDTO {
    user_id: string;
    product_id: string;
}

export interface FavouriteWithProductDTO extends FavouritesDB {
    product: ProductWithImagesDTO;
}
export interface PaginatedFavouritesDTO {
    data: FavouriteWithProductDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}



export interface CartDB {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface CartItemDB {
    cart_id: string;
    product_id: string;
    quantity: number;
    price_at_add: number;
}

export interface AddToCartDTO {
    cart_id: string;
    product_id: string;
    quantity: number;
    price_at_add: number;
}

export interface UpdateCartDTO {
    cart_id: string;
    product_id: string;
    quantity: number;
    price_at_add: number;
}

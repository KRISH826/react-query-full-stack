import { PoolClient } from "pg";

export interface CartDB {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface CartItemDB {
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    price_at_add: number;
}

// What controller sends → NO cart_id
export interface AddToCartDTO {
    product_id: string;
    variant_id: string;
    quantity: number;
}

// What service sends to repository → HAS cart_id + price
export interface AddToCartResponse {
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
}

// What controller sends → NO cart_id
export interface UpdateCartDTO {
    product_id: string;
    variant_id: string;
    quantity: number;
}

// What service sends to repository → HAS cart_id
export interface UpdateCartItemDB {
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
}

export interface CartItemWithDetailsDB {
    product_id: string;
    variant_id: string;
    quantity: number;
    price_at_add: number;
    offer_price_override: number | null;
    productname: string;
    brand: string;
    image_url: string | null;
    size: string | null;
}

export interface CartItemResponseDTO {
    productId: string;
    variantId: string;
    productName?: string;
    size?: string;
    brand?: string;
    imageUrl?: string;
    quantity: number;
    price: number;
    offerPrice: number | null;
    subtotal: number;
}

export interface CartResponseDTO {
    cartId: string;
    items: CartItemResponseDTO[];
    total: number;
    updatedAt: Date;
}
export interface CartItem {
    productId: string;
    variantId: string;
    productName?: string;
    size?: string;
    brand?: string;
    imageUrl?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface CartResponse {
    cartId: string;
    items: CartItem[];
    total: number;
    updatedAt: Date;
}

export interface BackendCartResponse {
    success?: boolean;
    data?: CartResponse;
}
export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    brand?: string;
    imageUrl: string;
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
    message?: CartResponse; // for getCart
    data?: CartResponse;    // for mutations
}
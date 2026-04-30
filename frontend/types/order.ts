export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'payment_pending' | 'payment_failed';

export interface ShippingAddressDTO {
    shipping_address: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
}

export interface OrderItemResponseDTO {
    id: string;
    product_id: string;
    productname: string;
    product_brand: string;
    image_url?: string | null;
    size?: string | null;
    quantity: number;
    price: number;
    offerPrice: number;
    status: OrderStatus;
    subtotal: number;
}

export interface OrderResponseDTO {
    id: string;
    ordernumber: string;
    status: OrderStatus;
    totalamount: number;
    items: OrderItemResponseDTO[];
    shippingaddress: ShippingAddressDTO;
    phone: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    delivered_at?: Date | null;
    cancelled_at?: Date | null;
}

export interface FlatOrderItem extends OrderItemResponseDTO {
    ordernumber: string;
    status: OrderStatus;
    created_at: Date;
    totalamount: number;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddressDTO;
    phone: string;
    email: string;
}

export interface BuyNowOrderRequest extends CreateOrderRequest {
    productId: string;
    variant_id: string;
    quantity: number;
}

export interface OrderJobStatusResponse {
    state: "waiting" | "active" | "completed" | "failed";
    order?: OrderResponseDTO;
    message?: string;
    reason?: string;
}

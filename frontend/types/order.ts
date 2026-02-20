export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface ShippingAddressDTO {
    shipping_address: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
}

export interface OrderItemResponseDTO {
    order_id: string;
    product_id: string;
    productname: string;
    product_brand: string;
    image_url?: string | null;
    quantity: number;
    price: number;
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
export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderDB {
    id: string;
    user_id: string;
    order_number: string;
    total_amount: number;
    status: OrderStatus;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    shipping_country: string;
    phone: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
}

export interface OrderItemDB {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_brand?: string;
    quantity: number;
    price_at_purchase: number;
    subtotal: number;
    created_at: Date;
}

// DTO

export interface ShippingAddressDTO {
    shipping_address: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
}

export interface CreateOrderDTO {
    shippingAddress: ShippingAddressDTO;
    phone: string;
    email: string;
}

export interface OrderItemResponseDTO {
    order_id: string;
    product_id: string;
    productname: string;
    product_brand: string;
    image_url?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderResponseDTO {
    id: string;
    ordernumber: string;
    status: OrderStatus;
    totalamount: string;
    items: OrderItemResponseDTO[];
    shippingaddress: ShippingAddressDTO;
    phone: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
}

export interface OrderListItemDTO {
    id: string;
    ordernumber: string;
    status: OrderStatus;
    totalamount: string;
    totalquantity: number;
    created_at: Date;
}




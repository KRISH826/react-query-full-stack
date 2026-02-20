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
    delivered_at?: Date | null;
    cancelled_at?: Date | null;
}

// ✅ image_url added
export interface OrderItemDB {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_brand?: string;
    quantity: number;
    price_at_purchase: number;
    subtotal: number;
    image_url?: string | null;
    created_at: Date;
}

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

// ✅ clean — no ordernumber/status here, those live on OrderResponseDTO
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

export interface DirectPurchaseDTO {
    productId: string;
    quantity: number;
    shippingAddress: ShippingAddressDTO;
    phone: string;
    email: string;
}

export interface OrderListItemDTO {
    id: string;
    ordernumber: string;
    status: OrderStatus;
    totalamount: string;
    totalquantity: number;
    created_at: Date;
}
export interface ShippingAddress {
    shipping_address: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddress;
    phone: string;
    email: string;
}

// export interface CreateOrderResponse {
//     message: string;
//     order: any; // later replace with proper OrderResponseDTO
// }
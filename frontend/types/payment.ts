export type PaymentStatus =
    | "pending"
    | "success"
    | "failed"
    | "refunded";



export interface CreatePaymentResponse {
    message: string;
    id: string;
    order_id: string;
    razorpay_order_id: string;
    amount: number;
    status: PaymentStatus;
    created_at: string;
}

export interface VerifyPaymentRequest {
    order_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface CreatePaymentRequest {
    order_id: string;
    amount: number;
}

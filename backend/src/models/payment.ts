export type PaymentStatus =
    | "pending"
    | "success"
    | "failed"
    | "refunded";



export interface PaymentDB {
    id: string;
    order_id: string;
    razorpay_order_id: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    amount: number;
    status: PaymentStatus;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePaymentDto {
    order_id: string;
    amount: number;
}

export interface VerifyPaymentDto {
    order_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

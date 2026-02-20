import { CreateOrderRequest, OrderResponseDTO } from "@/types/order";
import { baseApi } from "./baseQuery";
import { CreatePaymentRequest, CreatePaymentResponse, VerifyPaymentRequest } from "@/types/payment";

interface OrdersFullResponse {
    orders: OrderResponseDTO[];
}

interface OrderDetailResponse {
    order: OrderResponseDTO;
}

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkOut: builder.mutation<{ message: string; order: OrderResponseDTO }, CreateOrderRequest>({
            query: (order) => ({
                url: "orders/checkout",
                method: "POST",
                body: order,
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "Cart", id: "USER_CART" },
            ],
        }),
        getOrders: builder.query<OrderResponseDTO[], void>({
            query: () => "orders",
            transformResponse: (response: OrdersFullResponse) => response.orders,
            providesTags: [{ type: "Order", id: "LIST" }],
        }),
        getOrderById: builder.query<OrderResponseDTO, string>({
            query: (orderId) => `orders/${orderId}`,
            transformResponse: (response: OrderDetailResponse) => response.order,
            providesTags: [{ type: "Order", id: "ORDER_DETAIL" }],
        }),
        cancelOrder: builder.mutation<{ message: string }, string>({
            query: (orderId) => ({
                url: `orders/${orderId}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "Order", id: "ORDER_DETAIL" },
            ],
        }),
        buyNowOrder: builder.mutation<{ message: string; order: OrderResponseDTO }, CreateOrderRequest>({
            query: (order) => ({
                url: "orders/buy-now",
                method: "POST",
                body: order,
            }),
            invalidatesTags: [{ type: "Order", id: "LIST" }],
        }),
        createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
            query: (body) => ({ url: "payments/create-payment", method: "POST", body }),
        }),
        verifyPayment: builder.mutation<{ message: string; payment: boolean }, VerifyPaymentRequest>({
            query: (body) => ({ url: "payments/verify-payment", method: "POST", body }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "Order", id: "ORDER_DETAIL" },
            ],
        }),
    }),
});

export const {
    useCheckOutMutation,
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCancelOrderMutation,
    useBuyNowOrderMutation,
    useCreatePaymentMutation,
    useVerifyPaymentMutation,
} = orderApi;
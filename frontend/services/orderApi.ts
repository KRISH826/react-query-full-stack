import { CreateOrderRequest, OrderJobStatusResponse, OrderResponseDTO } from "@/types/order";
import { baseApi } from "./baseQuery";
import { CreatePaymentRequest, CreatePaymentResponse, VerifyPaymentRequest } from "@/types/payment";

interface OrdersFullResponse {
    orders: OrderResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface SuccessResponse {
    success: boolean;
    message: string;
}

interface OrderDetailResponse {
    order: OrderResponseDTO;
}

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkOut: builder.mutation<{ message: string; jobId: string }, CreateOrderRequest>({
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
        getOrders: builder.query<OrdersFullResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => `orders?page=${page}&limit=${limit}`,
            transformResponse: (response: { message: string; orders: OrdersFullResponse }) => response.orders,
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
                method: "PATCH",
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "Order", id: "ORDER_DETAIL" },
            ],
        }),
        cancelOrderItems: builder.mutation<{ message: string }, { orderId: string, itemsId: string }>({
            query: ({ orderId, itemsId }) => ({
                url: `orders/${orderId}/items/${itemsId}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "Order", id: "ORDER_DETAIL" },
            ],
        }),
        buyNowOrder: builder.mutation<{ message: string; jobId: string }, CreateOrderRequest>({
            query: (order) => ({
                url: "orders/buy-now",
                method: "POST",
                body: order,
            }),
            invalidatesTags: [{ type: "Order", id: "LIST" }],
        }),

        getOrderJobStatus: builder.query<OrderJobStatusResponse, string>({
            query: (jobId) => `orders/job/${jobId}`,
            
        }),

        // payment
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

        getAllOrders: builder.query<OrderResponseDTO[], void>({
            query: () => "orders/admin",
            transformResponse: (response: { message: string; orders: OrdersFullResponse }) => response.orders.orders,
            providesTags: [{ type: "Order", id: "LIST" }],
        }),
        deleteOrderItem: builder.mutation<{ success: boolean; message: string }, { orderId: string; itemId: string }>({
            query: ({ orderId, itemId }) => ({
                url: `orders/${orderId}/items/${itemId}`,
                method: "DELETE",
            }),
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
    useCancelOrderItemsMutation,
    useGetAllOrdersQuery,
    useDeleteOrderItemMutation,
    useLazyGetOrderJobStatusQuery
} = orderApi;
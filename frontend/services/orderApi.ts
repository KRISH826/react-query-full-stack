import { CreateOrderRequest, OrderResponseDTO } from "@/types/order";
import { baseApi } from "./baseQuery";

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
    }),
});

export const {
    useCheckOutMutation,
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCancelOrderMutation,
    useBuyNowOrderMutation,
} = orderApi;
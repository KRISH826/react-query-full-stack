import { CreateOrderRequest } from "@/types/order";
import { baseApi } from "./baseQuery";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<CreateOrderRequest, CreateOrderRequest>({
            query: (order: CreateOrderRequest) => ({
                url: "orders/checkout",
                method: "POST",
                body: order,
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "Cart", id: "USER_CART" },
            ],
        }),
    })
})

export const { useCreateOrderMutation } = orderApi;
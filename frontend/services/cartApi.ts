import { BackendCartResponse, CartResponse } from "@/types/cart";
import { baseApi } from "./baseQuery";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<CartResponse, void>({
            query: () => ({
                url: "cart",
                method: "GET",
            }),
            transformResponse: (response: BackendCartResponse) => response.message as CartResponse,
            providesTags: [{ type: "Cart", id: "USER_CART" }],
        }),
        addToCart: builder.mutation<
            CartResponse,
            { product_id: string; quantity: number }
        >({
            query: (body) => ({
                url: "cart",
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft: CartResponse) => {
                        if (!draft) return;
                        const existingItem = draft.items.find(
                            (item: { productId: string; }) => item.productId === arg.product_id
                        );

                        if (existingItem) {
                            existingItem.quantity += arg.quantity;
                            existingItem.subtotal = existingItem.quantity * existingItem.price;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: [{ type: "Cart", id: "USER_CART" }],
        }),

        updateCart: builder.mutation<CartResponse, { product_id: string; quantity: number }>({
            query: (body) => ({
                url: "cart",
                method: "PUT",
                body,
            }),
            transformResponse: (response: BackendCartResponse) =>
                response.data as CartResponse,
            invalidatesTags: [{ type: "Cart", id: "USER_CART" }],
        }),
        deleteCart: builder.mutation<CartResponse, { product_id: string }>({
            query: (body) => ({
                url: "cart",
                method: "DELETE",
                body,
            }),
            transformResponse: (response: BackendCartResponse) =>
                response.data as CartResponse,
            invalidatesTags: [{ type: "Cart", id: "USER_CART" }],
        }),

        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: "cart/clear",
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Cart", id: "USER_CART" }]
        })
    })
})

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartMutation, useDeleteCartMutation, useClearCartMutation } = cartApi;
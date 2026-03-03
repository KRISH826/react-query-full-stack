import { BackendCartResponse, CartResponse } from "@/types/cart";
import { baseApi } from "./baseQuery";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<CartResponse, void>({
            query: () => ({
                url: "cart",
                method: "GET",
            }),
            transformResponse: (response: BackendCartResponse) => response.data as CartResponse,
            providesTags: [{ type: "Cart", id: "USER_CART" }],
        }),
        addToCart: builder.mutation<
            CartResponse,
            { product_id: string; variant_id: string; quantity: number }
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
                            (item) =>
                                item.productId === arg.product_id && item.variantId === arg.variant_id
                        );

                        if (existingItem) {
                            existingItem.quantity += arg.quantity;
                            existingItem.subtotal = existingItem.quantity * existingItem.offerPrice;
                        }
                        draft.total = draft.items.reduce((sum, item) => sum + item.subtotal, 0);
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

        updateCart: builder.mutation<CartResponse, { product_id: string; variant_id: string; quantity: number }>({
            query: (body) => ({
                url: "cart",
                method: "PUT",
                body,
            }),
            transformResponse: (response: BackendCartResponse) =>
                response.data as CartResponse,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft: CartResponse) => {
                        if (!draft) return;
                        const itemToUpdate = draft.items.find(
                            (item) =>
                                item.productId === arg.product_id && item.variantId === arg.variant_id
                        );

                        if (itemToUpdate) {
                            itemToUpdate.quantity = arg.quantity;
                            itemToUpdate.subtotal = itemToUpdate.quantity * itemToUpdate.offerPrice;
                        }
                        draft.total = draft.items.reduce((sum, item) => sum + item.subtotal, 0);
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
        deleteCart: builder.mutation<CartResponse, { variant_id: string }>({
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
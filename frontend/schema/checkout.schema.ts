import { z } from "zod";

export const checkOutSchema = z.object({
    shippingAddress: z.object({
        shipping_address: z.string().min(5, "Shipping address is required"),
        city: z.string().min(3, "City is required"),
        state: z.string().min(3, "State is required"),
        postalcode: z.string().min(6, "Postal code is required"),
        country: z.string().min(3, "Country is required"),
    }),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().min(1, "Email is required"),
})

export type CheckOutSchema = z.infer<typeof checkOutSchema>
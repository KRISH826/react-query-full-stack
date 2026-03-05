import { z } from "zod";

export const profileSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postcode: z.string().min(4, "Postcode must be at least 4 characters"),
    country: z.string().min(1, "Country is required"),
    profileImage: z.union([z.instanceof(File), z.string(), z.undefined()]).optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
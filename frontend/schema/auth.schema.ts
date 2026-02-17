import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email("Enter a valid email")
        .min(1, "Email is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;




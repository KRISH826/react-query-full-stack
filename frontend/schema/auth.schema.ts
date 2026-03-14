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



export const registerSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z
        .email("Enter a valid email")
        .min(1, "Email is required"),
    role: z.enum(["customer", "admin"]).default("customer"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
})

export type RegisterValues = z.input<typeof registerSchema>;

export const resetSchema = z.object({
    password: z.string().min(8, "Minimum 8 characters").regex(/[A-Z]/, "One uppercase required").regex(/[0-9]/, "One number required").regex(/[^a-zA-Z0-9]/, "One special character required"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const forgotSchema = z.object({
    email: z.email("Invalid email address"),
});
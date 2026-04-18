"use client";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { LoginValues, loginSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '@/services/userApi'
import { Spinner } from '@/components/ui/spinner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const UserAuthForm = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const [login, { isLoading }] = useLoginMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callBackUrl = searchParams.get("callbackUrl") || "/product";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched"
    });
    const onSubmit = async (data: LoginValues) => {
        try {
            const response = await login(data).unwrap();
            toast.success("Login successful");
            reset();

            const role = response?.user?.role;
            let destination = "/product"; // Default destination

            // Destination decide kar rahe hain
            if (role === "admin") {
                destination = "/admin/dashboard";
            } else {
                if (callBackUrl.startsWith("/admin")) {
                    destination = "/product";
                } else {
                    destination = callBackUrl;
                }
            }

            window.location.replace(destination);

        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Login failed";
            toast.error(errorMessage);
        }
    }
    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-3'>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="email">Email</Label>
                        <Input id="email" className='h-10 text-base!' type="email" placeholder="name@example.com" {...register("email")} />
                        <p className='text-red-600 text-sm'>{errors.email?.message}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="password">Password</Label>
                        <Input id="password" className='h-10 text-base!' type="password" placeholder="name@example.com" {...register("password")} />
                        <p className='text-red-600 text-sm'>{errors.password?.message}</p>
                        <div className='w-full flex justify-end'>
                            <Link href="/forget-password" className='text-sm hover:text-primary underline underline-offset-4'>
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {
                            isLoading ? <Spinner className='text-white size-4' /> : "Sign in"
                        }
                    </Button>
                </div>
            </form>

        </div>
    )
}

export default UserAuthForm
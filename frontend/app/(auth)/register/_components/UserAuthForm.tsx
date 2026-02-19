"use client"
import { toast } from 'sonner';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useRegisterUserMutation } from '@/services/userApi'
import { RegisterValues, registerSchema } from '@/schema/auth.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/ui/spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const UserAuthForm = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: RegisterValues) => {
        try {
            await registerUser(data).unwrap();
            toast.success("Account created successfully");
            reset();
            router.replace("/login");
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Registration failed";
            toast.error(errorMessage);
        }
    }

    return (
        <>
            <div className={cn("grid gap-5", className)} {...props}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-3'>
                        <div className='flex flex-col gap-2'>
                            <Label className='mb-1' htmlFor="name">Name</Label>
                            <Input id="name" className='h-10 text-base!' type="text" placeholder="Enter your name" {...register("name")} />
                            <p className='text-red-600 text-sm'>{errors.name?.message}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label className='mb-1' htmlFor="email">Email</Label>
                            <Input id="email" className='h-10 text-base!' type="email" placeholder="Enter your email" {...register("email")} />
                            <p className='text-red-600 text-sm'>{errors.email?.message}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label className='mb-1' htmlFor="password">Password</Label>
                            <Input id="password" className='h-10 text-base!' type="password" placeholder="Enter your password" {...register("password")} />
                            <p className='text-red-600 text-sm'>{errors.password?.message}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label className='mb-1' htmlFor="role">Role</Label>
                            <Select>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className='text-red-600 text-sm'>{errors.role?.message}</p>
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {
                                isLoading ? <Spinner className='text-white size-4' /> : "Sign Up"
                            }
                        </Button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default UserAuthForm
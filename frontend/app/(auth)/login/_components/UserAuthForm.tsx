"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { LoginValues, loginSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

const UserAuthForm = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema)
    });
    const onSubmit = (data: LoginValues) => {
        console.log(data);
    }
    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-5'>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="email">Email</Label>
                        <Input id="email" className='h-10 text-base!' type="email" placeholder="name@example.com" {...register("email")} />
                        <p className='text-red-600 text-sm'>{errors.email?.message}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="password">Password</Label>
                        <Input id="password" className='h-10 text-base!' type="password" placeholder="name@example.com" {...register("password")} />
                        <p className='text-red-600 text-sm'>{errors.password?.message}</p>
                    </div>
                    <Button type="submit">Continue</Button>
                </div>
            </form>

        </div>
    )
}

export default UserAuthForm
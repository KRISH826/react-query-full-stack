"use client";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Spinner } from '@/components/ui/spinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { resetSchema } from '@/schema/auth.schema';


type ResetValues = z.infer<typeof resetSchema>;

const ResetPasswordForm = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetValues>({
        resolver: zodResolver(resetSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: ResetValues) => {
        if (otp.length !== 6) {
            toast.error("Please enter complete 6-digit code");
            return;
        }
        try {
            // API call here
            toast.success("Password reset successful!");
            router.push("/login");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-3'>
                    <div className='flex flex-col items-center gap-3'>
                        <p className="text-muted-foreground text-sm w-full">
                            Code sent to <span className="text-foreground font-semibold">{email}</span>
                        </p>
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup className="gap-2">
                                <InputOTPSlot index={0} className="h-12 w-12 text-lg border rounded-md focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-foreground shadow-none" />
                                <InputOTPSlot index={1} className="h-12 w-12 text-lg border rounded-md focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-foreground shadow-none" />
                                <InputOTPSlot index={2} className="h-12 w-12 text-lg border rounded-md focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-foreground shadow-none" />
                                <InputOTPSlot index={3} className="h-12 w-12 text-lg border rounded-md focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-foreground shadow-none" />
                                <InputOTPSlot index={4} className="h-12 w-12 text-lg border rounded-md focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-foreground shadow-none" />
                                <InputOTPSlot index={5} className="h-12 w-12 text-lg border rounded-md focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-foreground shadow-none" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="password">New Password</Label>
                        <Input id="password" className='h-10 text-base!' type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" {...register("password")} />
                        <p className='text-red-600 text-sm'>{errors.password?.message}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" className='h-10 text-base!' type="password" placeholder="Repeat your password" {...register("confirmPassword")} />
                        <p className='text-red-600 text-sm'>{errors.confirmPassword?.message}</p>
                    </div>
                    <Button type="submit" disabled={isSubmitting || otp.length !== 6}>
                        {isSubmitting ? <Spinner className='text-white size-4' /> : "Reset Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
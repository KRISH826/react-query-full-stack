"use client";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { forgotSchema } from '@/schema/auth.schema';
import { useForgetPasswordMutation } from '@/services/userApi';

type ForgotValues = z.infer<typeof forgotSchema>;

const ForgotPasswordForm = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const router = useRouter();
    const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotValues>({
        resolver: zodResolver(forgotSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: ForgotValues) => {
        try {
            await forgetPassword({ email: data.email }).unwrap();
            toast.success("Reset code sent to your email!");
            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Login failed";
            toast.error(errorMessage);
        }
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-3'>
                    <div className='flex flex-col gap-2'>
                        <Label className='mb-1' htmlFor="email">Email</Label>
                        <Input id="email" className='h-10 text-base!' type="email" placeholder="name@example.com" {...register("email")} />
                        <p className='text-red-600 text-sm'>{errors.email?.message}</p>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner className='text-white size-4' /> : "Send Reset Code"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
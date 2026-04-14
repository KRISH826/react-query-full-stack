"use client";
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { useVerifyEmailMutation, useResendVerificationMailMutation } from '@/services/userApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyEmailForm = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [resendVerificationMail, { isLoading: isResending }] = useResendVerificationMailMutation();
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter complete 6-digit code");
            return;
        }
        try {
            await verifyEmail({ email, code: otp }).unwrap();
            toast.success("Email verified successfully!");
            router.push("/login");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.data?.message || "Verification failed");
        }
    }

    const handleResend = async () => {
        try {
            await resendVerificationMail({ email }).unwrap();
            toast.success("Verification code resent!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to resend code");
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className='grid gap-4'>
                    <div className='flex flex-col items-center gap-3'>
                        <p className="text-muted-foreground text-sm">
                            Code sent to <span className="text-foreground font-medium">{email}</span>
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
                    <Button type="submit" disabled={isLoading || otp.length !== 6}>
                        {isLoading ? <Spinner className='text-white size-4' /> : "Verify Email"}
                    </Button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-muted-foreground text-sm">
                    Didn&apos;t receive the code?{" "}
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="hover:text-primary underline underline-offset-4 text-sm disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : "Resend Code"}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default VerifyEmailForm
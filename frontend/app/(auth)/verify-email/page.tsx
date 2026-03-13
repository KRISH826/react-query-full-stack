// app/verify-email/page.tsx
import Image from "next/image";
import { Suspense } from "react";
import VerifyEmailForm from "./_components/VerfiyEmail";

export default function Page() {
    return (
        <div className="relative flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
                <div className="absolute w-full inset-0">
                    <Image
                        src="/images/login.jpg"
                        width={1080}
                        height={1080}
                        alt="Fashion"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                </div>
                <div className="relative z-20 flex items-center text-lg font-medium text-white/80">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6">
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    Acme Inc
                </div>
                <div className="relative z-20 mt-auto max-w-3xl text-white/70">
                    <blockquote className="leading-normal text-balance">
                        &ldquo;This library has saved me countless hours of work and helped me deliver stunning
                        designs to my clients faster than ever before.&rdquo; - Sofia Davis
                    </blockquote>
                </div>
            </div>
            <div className="flex items-center justify-center lg:h-screen lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center gap-4 sm:w-[350px]">
                    <div className="flex flex-col mb-4 gap-2 text-start">
                        <h1 className="text-2xl font-semibold tracking-tight">Verify Email</h1>
                        <p className="text-muted-foreground text-sm">
                            Enter the verification code sent to your email
                        </p>
                    </div>
                    <Suspense>
                        <VerifyEmailForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
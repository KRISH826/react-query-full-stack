import { Suspense } from "react";
import Link from "next/link";
import ForgotPasswordForm from "./_components/ForgetPasswordForm";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      title="Forgot Password"
      description="Enter your email and we&apos;ll send you a reset code"
      imageSrc="/images/login2.webp"
      footer={
        <p className="px-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      }
    >
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}

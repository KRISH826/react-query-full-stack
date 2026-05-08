import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";
import Link from "next/link";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      title="Reset Password"
      description="Enter the code sent to your email and your new password"
      imageSrc="/images/login2.jpg"
      footer={
        <p className="px-8 text-center text-sm text-muted-foreground">
          Back to{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      }
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}

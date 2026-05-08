import Link from "next/link";
import UserAuthForm from "./_components/UserAuthForm";
import { Suspense } from "react";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      title="Sign In"
      description="Enter your email below to sign in"
      imageSrc="/images/login.webp"
      footer={
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Register
          </Link>
          .
        </p>
      }
    >
      <Suspense>
        <UserAuthForm />
      </Suspense>
    </AuthPageShell>
  );
}

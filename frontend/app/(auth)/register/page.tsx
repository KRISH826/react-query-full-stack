import Link from "next/link";
import UserAuthForm from "./_components/UserAuthForm";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      title="Sign Up"
      description="Enter your email below to sign up"
      imageSrc="/images/login.webp"
      footer={
        <p className="px-8 text-center text-sm text-muted-foreground">
          Have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign In
          </Link>
          .
        </p>
      }
    >
      <UserAuthForm />
    </AuthPageShell>
  );
}

import { Suspense } from "react";
import VerifyEmailForm from "./_components/VerfiyEmail";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      title="Verify Email"
      description="Enter the verification code sent to your email"
      imageSrc="/images/login.jpg"
    >
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </AuthPageShell>
  );
}

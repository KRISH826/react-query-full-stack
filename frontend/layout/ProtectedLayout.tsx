import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = await getServerAuth();

  if (!isAuthenticated) {
    redirect("/login?callbackUrl=/product");
  }

  return <>{children}</>;
}

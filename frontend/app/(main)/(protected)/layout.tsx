import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshToken } = await getServerAuth();

  if (!refreshToken) {
    redirect("/login?callbackUrl=/product");
  }

  return <>{children}</>;
}
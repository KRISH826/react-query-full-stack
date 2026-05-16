import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = await getServerAuth();

  // 🔐 If already logged in → redirect away
  if (isAuthenticated) {
    redirect(role === "admin" ? "/admin/dashboard" : "/product");
  }

  return <div className="font-auth">{children}</div>;
}

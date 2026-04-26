import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = await getServerAuth();

  // 🔐 Not logged in
  if (!isAuthenticated) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  // 🔐 Not admin
  if (role !== "admin") {
    redirect("/product");
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
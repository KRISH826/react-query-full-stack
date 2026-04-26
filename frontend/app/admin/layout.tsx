import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value
    const role = cookieStore.get('role')?.value

    if (!refreshToken || !role) {
        redirect('/login?callbackUrl=/admin/dashboard')
    }

    if (role !== 'admin') {
        redirect('/product')
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/20">
            <AdminSidebar />
            <div className="flex flex-1 flex-col lg:pl-64">
                <AdminHeader />
                <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value
    const role = cookieStore.get('role')?.value

    if (refreshToken) {
        redirect(role === 'admin' ? '/admin/dashboard' : '/product')
    }

    return <>{children}</>
}
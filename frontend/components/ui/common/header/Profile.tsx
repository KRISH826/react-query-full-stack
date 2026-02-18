"use client"
import { useGetProfileQuery, useLogoutMutation } from '@/services/userApi'
import { Button } from '../../button'
import { User } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../dropdown-menu'
import { useRouter } from 'next/navigation'

const Profile = () => {
    const { data: user, isLoading } = useGetProfileQuery();
    const [logout] = useLogoutMutation();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch {
            // Even if the API call fails, localStorage is already cleared
        } finally {
            router.push("/login");
        }
    };

    if (!user && !isLoading) {
        return (
            <Button asChild variant="ghost" size="icon">
                <Link href="/login">
                    <User className="h-5 w-5" />
                </Link>
            </Button>
        );
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="link" className="gap-1 cursor-pointer bg-transparent border-0! shadow-none! ring-0! outline-none focus:outline-none">
                        <User className="h-5 w-5" />
                        <span className="hidden sm:inline">
                            {user?.name.split(" ")[0]}
                        </span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-42">
                    <DropdownMenuItem asChild>
                        <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Profile
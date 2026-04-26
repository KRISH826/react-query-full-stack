"use client"
import RequireAuth from '@/components/auth/RequireAuth'
import ProfileForm from './_components/ProfileForm'
import { useGetProfileQuery } from '@/services/userApi'
import { Spinner } from '@/components/ui/spinner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const ProfilePage = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data: user, isLoading } = useGetProfileQuery(undefined, {
        skip: !token,
    });

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner className="h-12 w-12 text-primary" />
            </div>
        )
    }
    return (
        <RequireAuth>
            <section className="py-12 bg-gray-50/50 min-h-[90vh]">
                <div className="container">
                    <ProfileForm user={user} />
                </div>
            </section>
        </RequireAuth>
    )
}

export default ProfilePage

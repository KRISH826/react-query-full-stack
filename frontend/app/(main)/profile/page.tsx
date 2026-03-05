"use client"
import ProfileForm from './_components/ProfileForm'
import { useGetProfileQuery } from '@/services/userApi'
import { Spinner } from '@/components/ui/spinner'

const ProfilePage = () => {
    const { data: user, isLoading } = useGetProfileQuery();
    console.log(user);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner className="h-12 w-12 text-primary" />
            </div>
        )
    }
    return (
        <section className="py-12 bg-gray-50/50 min-h-[90vh]">
            <div className="container">
                <ProfileForm user={user} />
            </div>
        </section>
    )
}

export default ProfilePage
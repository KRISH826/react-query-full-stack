import React from 'react'
import FavouritePage from './_components/FavouritePage'
import RequireAuth from '@/components/auth/RequireAuth'

const page = () => {
    return (
        <RequireAuth>
            <div>
                <FavouritePage />
            </div>
        </RequireAuth>
    )
}

export default page

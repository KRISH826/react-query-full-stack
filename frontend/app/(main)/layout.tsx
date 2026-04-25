import React from 'react'
import MainWrapper from '@/components/ui/common/MainWrapper'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const layout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if(!refreshToken) {
         redirect('/login')
    }
    return (
        <MainWrapper>{children}</MainWrapper>
    )
}

export default layout
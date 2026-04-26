import React from 'react'
import MainWrapper from '@/components/ui/common/MainWrapper'

const layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <MainWrapper>{children}</MainWrapper>
    )
}

export default layout

import React from 'react'
import MainWrapper from '@/components/common/MainWrapper'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <MainWrapper>{children}</MainWrapper>
    )
}

export default layout
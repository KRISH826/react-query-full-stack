import React from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default layout
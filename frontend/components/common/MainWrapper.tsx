import React from 'react'
import Header from './Header'
import Footer from './Footer'

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1 lg:py-10 sm:py-7 py-5'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default MainWrapper
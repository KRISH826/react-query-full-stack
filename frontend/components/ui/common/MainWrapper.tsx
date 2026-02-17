import React from 'react'
import Header from './Header'
import Footer from './Footer'

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1 bg-white'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default MainWrapper
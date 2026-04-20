import React from 'react'
import Header from '../ui/common/Header'
import Footer from '../ui/common/Footer'
import BannerSection from './BannerSection'
import Collections from './Collections'
import BankOfferSection from './BankOfferSection'

const HomePage = () => {
    return (
        <>
            <Header />
            <main>
                <BannerSection />
                <BankOfferSection />
                <Collections />
            </main>
            <Footer />
        </>
    )
}

export default HomePage
import { CreditCard } from 'lucide-react'
import React from 'react'

const BankOfferSection = () => {
    return (
        <section className="w-full lg:py-12 md:py-10 sm:py-7 py-4">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* HDFC Offer */}
                    <div className="bg-card border border-border rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary transition-colors duration-300">

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    <CreditCard />
                                </span>
                                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                    HDFC Bank
                                </p>
                            </div>

                            <h3 className="font-extrabold text-xl sm:text-2xl text-primary tracking-tight leading-tight mb-1">
                                10% Instant Discount
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                On credit cards & EMI transactions
                            </p>
                        </div>

                        <div className="flex items-start sm:items-end">
                            <button className="text-xs uppercase tracking-widest text-primary border border-primary px-4 py-2 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                Apply Code
                            </button>
                        </div>
                    </div>

                    {/* ICICI Offer */}
                    <div className="bg-card border border-border rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary transition-colors duration-300">

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    <CreditCard />
                                </span>
                                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                    ICICI Bank Debit Cards
                                </p>
                            </div>

                            <h3 className="font-extrabold text-xl sm:text-2xl text-primary tracking-tight leading-tight mb-1">
                                12% Instant Discount
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                On select debit card transactions
                            </p>
                        </div>

                        <div className="flex items-start sm:items-end">
                            <button className="text-xs uppercase tracking-widest text-primary border border-primary px-4 py-2 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                Apply Code
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default BankOfferSection

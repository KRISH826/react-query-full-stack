import { CreditCard } from 'lucide-react'
import React from 'react'

const BankOfferSection = () => {
    return (
        <section className="w-full lg:py-12 md:py-10 sm:py-7 py-4">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HDFC Offer */}
                    <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between group hover:border-primary transition-colors duration-300">

                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    <CreditCard />
                                </span>
                                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                    HDFC Bank
                                </p>
                            </div>

                            <h3 className="font-extrabold text-2xl text-primary tracking-tight mb-1">
                                10% Instant Discount
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                On credit cards & EMI transactions
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end">
                            <button className="text-xs uppercase tracking-widest text-primary border border-primary px-4 py-2 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                Apply Code
                            </button>
                        </div>
                    </div>

                    {/* ICICI Offer */}
                    <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between group hover:border-primary transition-colors duration-300">

                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    <CreditCard />
                                </span>
                                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                    ICICI Bank Debit Cards
                                </p>
                            </div>

                            <h3 className="font-extrabold text-2xl text-primary tracking-tight mb-1">
                                12% Instant Discount
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                On select debit card transactions
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end">
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
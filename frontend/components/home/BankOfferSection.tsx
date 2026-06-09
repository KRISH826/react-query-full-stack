import { ArrowRight, CreditCard, WalletCards } from 'lucide-react'
import React from 'react'

const offers = [
    {
        bank: 'HDFC Bank',
        title: '10% Instant Discount',
        subtitle: 'On credit cards & EMI transactions',
        code: 'HDFC10',
        note: 'Valid on orders above Rs. 3,999',
    },
    {
        bank: 'ICICI Debit Cards',
        title: '12% Instant Discount',
        subtitle: 'On select debit card transactions',
        code: 'ICICI12',
        note: 'Valid on orders above Rs. 2,499',
    },
]

const BankOfferSection = () => {
    return (
        <section className="w-full lg:py-12 md:py-10 sm:py-7 py-4">
            <div className="container">
                <div className="rounded-2xl border border-border bg-secondary/35 p-4 sm:p-6 lg:p-8">
                    <div className="mb-5 sm:mb-7 flex items-start sm:items-end justify-between gap-4">
                        <div>
                            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                                <WalletCards className="h-4 w-4 text-primary" />
                                Bank Offers
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Save More Shopping Fashion at DropCulture</h2>
                        </div>
                        <p className="hidden md:block text-sm text-muted-foreground">
                            Auto-applied offers for eligible cards.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {offers.map((offer) => (
                            <article
                                key={offer.code}
                                className="group relative overflow-hidden rounded-xl border border-border/80 bg-background p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                            >
                                <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-primary/30 via-primary to-primary/30" />
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="inline-flex items-center gap-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <CreditCard className="h-4 w-4" />
                                                </span>
                                                {offer.bank}
                                            </p>

                                            <h3 className="font-extrabold text-xl sm:text-2xl text-primary tracking-tight leading-tight mb-1">
                                                {offer.title}
                                            </h3>

                                            <p className="text-sm text-muted-foreground">
                                                {offer.subtitle}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest">
                                            Limited
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="inline-flex items-center rounded-lg border border-dashed border-border px-3 py-2 bg-muted/50">
                                            <span className="text-xs text-muted-foreground mr-2 uppercase tracking-wider">Code</span>
                                            <span className="font-bold text-sm text-foreground tracking-wide">{offer.code}</span>
                                        </div>

                                        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                                            Apply Offer
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        {offer.note}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BankOfferSection

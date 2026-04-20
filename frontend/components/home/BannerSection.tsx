import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const BannerSection = () => {
    return (
        <section className="relative min-h-screen flex items-center bg-surface-light dark:bg-surface-dark overflow-hidden">
            <Image
                alt="Fashionable lifestyle shot"
                fill
                priority
                className="object-cover opacity-80 dark:opacity-50 z-0"
                src="/images/login.webp"
            />
            <div className="absolute inset-0 bg-linear-to-l from-primary/30 via-transparent to-primary/75"></div>
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary text-secondary text-sm font-bold tracking-wider uppercase mb-6 shadow-sm">New Collection Arrival</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-secondary dark:text-primary tracking-tight">Elevate <br />Your Essentials.</h1>
                    <p className="text-lg text-slate-800 text-text-muted-light dark:text-text-muted-dark mb-10 max-w-lg leading-relaxed">Discover a curated collection of premium fashion designed for the modern individual. Elevate your everyday with ShopNova.</p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-primary text-white px-8 py-4 rounded-full font-medium text-base hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 uppercase tracking-widest">
                            Shop Now <ArrowRight />
                        </button>
                        <button className="bg-secondary text-primary dark:bg-surface-dark dark:text-primary border border-border-light dark:border-border-dark px-8 py-4 rounded-full font-medium text-base hover:bg-surface-light dark:hover:bg-background-dark transition-all flex items-center gap-2 uppercase tracking-widest">
                            View Lookbook
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BannerSection
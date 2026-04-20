import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BannerSection = () => {
    return (
        <section className="relative isolate overflow-hidden bg-surface-light dark:bg-surface-dark">
            <Image
                alt="Fashionable lifestyle shot"
                fill
                priority
                className="object-cover object-center opacity-95 z-0"
                src="/images/login.webp"
            />
            <div className="absolute inset-0 z-0 bg-linear-to-r from-black/65 via-black/45 to-black/25" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.10),transparent_45%)]" />
            <div className="absolute -left-20 top-16 z-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-20 bottom-8 z-0 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />

            <div className="container relative z-10">
                <div className="min-h-[calc(100svh-64px)] py-10 sm:py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-wider uppercase mb-5 shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            New Collection Arrival
                        </span>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-4 sm:mb-6 text-white tracking-tight">
                            Elevate <br />Your Essentials.
                        </h1>

                        <p className="text-base sm:text-lg text-white/90 mb-7 sm:mb-10 max-w-xl leading-relaxed">
                            Discover a curated collection of premium fashion designed for the modern individual. Elevate your everyday with ShopNova.
                        </p>

                        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
                            <Link href="/product" className="bg-primary text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 uppercase tracking-widest">
                                Shop Now <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                            <button className="bg-white/95 text-primary border border-white/80 px-4 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base hover:bg-white transition-all flex items-center gap-2 uppercase tracking-widest">
                                View Lookbook
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2.5 sm:gap-3">
                            {[
                                { label: 'Secure Checkout', icon: ShieldCheck },
                                { label: 'Free Shipping', icon: Truck },
                                { label: 'Premium Quality', icon: Sparkles },
                            ].map(({ label, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 backdrop-blur-sm px-3 py-1.5 text-xs sm:text-sm font-medium text-white"
                                >
                                    <Icon className="h-3.5 w-3.5 text-white" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block w-[320px]">
                        <div className="rounded-2xl border border-white/35 bg-black/35 backdrop-blur-md p-6 shadow-2xl">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3">Style Forecast</p>
                            <h3 className="text-2xl font-bold text-white leading-tight mb-2">Modern Layers</h3>
                            <p className="text-sm text-white/80 leading-relaxed mb-5">
                                Sharp tailoring meets relaxed silhouettes with soft textures and neutral palettes.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-white/30 bg-white/10 p-3">
                                    <p className="text-xs text-white/70 mb-1">Best Seller</p>
                                    <p className="font-semibold text-white">Urban Set</p>
                                </div>
                                <div className="rounded-xl border border-white/30 bg-white/10 p-3">
                                    <p className="text-xs text-white/70 mb-1">Editor Pick</p>
                                    <p className="font-semibold text-white">Cozy Line</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BannerSection

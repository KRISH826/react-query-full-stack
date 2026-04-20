import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Collections = () => {
    return (
        <section className="lg:py-12 md:py-10 sm:py-7 py-4 bg-background dark:bg-background">
            <div className="container">

                {/* Header */}
                <div className="flex justify-between items-end mb-8 sm:mb-12">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary mb-2">
                            Curated Collections
                        </h2>
                        <p className="text-muted-foreground">
                            Explore our thoughtfully selected styles for every occasion.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* CARD 1 */}
                    <a className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md" href="#">
                        <Image width={500}
                            height={500}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzDZUtJZkaCflkHCrhhC3_mGhJvUjFWZe_7jWq1QoH8QdDIIMv0MMA3IvLwvzmekChycIRHMvnprzIXryL0H2c04UI3QLICmi-vj1HpJRcai-SKRsCzvLwjLLHfRdBGP5-taG352fVonx2UxtDEb-Zqh84dfoMrXuBYHPmKeltwoAZNyZ4nNXqaRVxwoUDi4nVhuSWUgTnBJcJZ79YknLvK0HgtLcpK_HdZr2O82QHNCy-mvynC1VgDbsglbOryfq0cqyCZfzBl93b"
                            alt="GenZ Fashion"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-5 sm:p-8 w-full">
                            <span className="text-white/80 text-sm font-semibold uppercase mb-2 block">
                                Trending Now
                            </span>
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">GenZ</h3>
                                <span className="material-icons text-white bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-all">
                                    <ArrowRight />
                                </span>
                            </div>
                        </div>
                    </a>

                    {/* CARD 2 */}
                    <a className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md" href="#">
                        <Image
                            width={500}
                            height={500}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuANrq6ysj8MPtVrQ-r7OznHtYNlMIo50tzG10KgsvQikXyDytcCmbatXNSihsYyzneUN5qz3PC2nzu5IaxHMF7xw1LCzdpbTJHr2idVQMIlVwc18aunMAOILOaWHyMdQiWvLV3eQX8tE6pmY12HJNa8Q3muUhQkE7N-emWLaodoupu17NvsS-LAfwAc9Y_Xt5sRE02jFF-KVyuZYBayUyh_j0RPqQM9e3LgT7VwxI215UE8RJwNH5YEDNmZHJxQas2neSmigZvq4wBJ"
                            alt="Summer Fashion"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute bottom-0 left-0 p-5 sm:p-8 w-full">
                            <span className="text-white/80 text-sm font-semibold uppercase mb-2 block">
                                Light & Breezy
                            </span>

                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">Summer</h3>
                                <span className="material-icons text-white bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-all">
                                    <ArrowRight />
                                </span>
                            </div>
                        </div>
                    </a>

                    {/* CARD 3 */}
                    <a className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md" href="#">
                        <Image
                            width={500}
                            height={500}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVzgT6bd_m_vT6WV4gNNCJNN_eYg3Z-YlM1FH00MlorohpJbbKEKNg_KD1m7PMfK4wFyG4KAkJZGE6Xu8ZNMUo0XQQuDuqb_WTivBEV_ARPoljezcKiDeovk5KSIq3oi8AAMzm4OZZ9_l2GGI2Sgsg54mOuT4J2zuFqCPN7dWZ_YPOaIFEKACDJUc99HT5-TvliEDqpq2CBlmUfzOTQndfbGYZdKh6l6_o4gLrSfwEykrgqAylYzkczHKly1hW9mxNNB2DySaqtk25"
                            alt="Winter Fashion"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute bottom-0 left-0 p-5 sm:p-8 w-full">
                            <span className="text-white/80 text-sm font-semibold uppercase mb-2 block">
                                Cozy & Warm
                            </span>

                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">Winter</h3>
                                <span className="material-icons text-white bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-all">
                                    <ArrowRight />
                                </span>
                            </div>
                        </div>
                    </a>

                </div>
            </div>
        </section>
    )
}

export default Collections

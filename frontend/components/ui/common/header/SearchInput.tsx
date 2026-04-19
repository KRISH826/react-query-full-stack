'use client'

import { Search, TrendingUp, History, Sparkles, X } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AiSearch from './AiSearch'
import { DropdownItem } from '@/app/(main)/product-search/_components/DropDownItem'

const TRENDING_SEARCHES = [
    { text: "Men's T-Shirts", icon: TrendingUp },
    { text: 'Dresses for Women', icon: TrendingUp },
    { text: 'Sneakers & Casual Shoes', icon: Search },
    { text: 'Cotton Kurtas', icon: History }
] as const

function generateSuggestions(query: string): string[] {
    const q = query.toLowerCase()
    const suggestions: (string | null)[] = [
        query,
        (!q.includes('men') && !q.includes('women')) ? `${query} for Men` : null,
        (!q.includes('men') && !q.includes('women')) ? `${query} for Women` : null,
        (!q.includes('under') && !/\d/.test(query)) ? `${query} under ₹999` : null,
        (!q.includes('kids') && !q.includes('boy') && !q.includes('girl')) ? `${query} for Kids` : null,
    ]
    return suggestions.filter(Boolean).slice(0, 4) as string[]
}

const SearchInput = () => {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return
        setQuery(searchQuery)
        setIsFocused(false)
        inputRef.current?.blur()
        router.push(`/product-search/?q=${encodeURIComponent(searchQuery.trim())}`)
    }

    const handleClear = () => {
        setQuery('')
        inputRef.current?.focus()
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const suggestions = generateSuggestions(query)
    const showDropdown = isFocused

    return (
        <>
            <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden>
                <defs>
                    <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285f4" />
                        <stop offset="30%" stopColor="#9b72cb" />
                        <stop offset="70%" stopColor="#d96570" />
                        <stop offset="100%" stopColor="#f49c4f" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative items-center gap-1.5" ref={wrapperRef}>
                <form className="relative flex-1" onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for products, brands and more..."
                        className="w-full h-9 pl-9 pr-8 rounded-md border border-input bg-muted/50 text-sm outline-none transition-colors focus:bg-background focus:border-primary/50 placeholder:text-muted-foreground/60"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setIsFocused(false)
                                inputRef.current?.blur()
                            }
                        }}
                        role="combobox"
                        aria-label="Search products"
                        aria-autocomplete="list"
                        aria-expanded={showDropdown}
                        autoComplete="off"
                    />
                    {query && (
                        <button
                            type="button"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </form>

                {showDropdown && (
                    <div
                        role="listbox"
                        className="absolute top-full left-0 right-0 mt-1.5 z-50 overflow-hidden rounded-lg border border-border/60 bg-popover text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
                    >
                        <div className="p-1.5">
                            {!query.trim() ? (
                                <>
                                    <div className="flex items-center gap-1.5 px-2 py-1.5 mb-0.5">
                                        <Sparkles className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground tracking-wide">
                                            Trending
                                        </span>
                                    </div>
                                    {TRENDING_SEARCHES.map(({ text, icon: Icon }, idx) => (
                                        <DropdownItem
                                            key={idx}
                                            icon={<Icon className="h-3.5 w-3.5" />}
                                            label={text}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleSearch(text)}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {suggestions.map((item, idx) => (
                                        <DropdownItem
                                            key={idx}
                                            icon={<Search className="h-3.5 w-3.5" />}
                                            label={
                                                idx === 0
                                                    ? <><strong>{query}</strong>{item.slice(query.length)}</>
                                                    : item
                                            }
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleSearch(item)}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Search button — separate, compact */}
                <button
                    type="button"
                    onClick={() => handleSearch(query)}
                    className="h-9 w-9 shrink-0 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground inline-flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Search"
                >
                    <Search className="h-4 w-4" />
                </button>

                <AiSearch />
            </div>
        </>
    )
}

export default SearchInput
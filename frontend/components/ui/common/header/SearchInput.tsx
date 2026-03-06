import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../../input'
import AiSearch from './AiSearch'

const SearchInput = () => {
    return (
        <>
            {/* SVG definition for the Gemini-style gradient */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285f4" />
                        <stop offset="30%" stopColor="#9b72cb" />
                        <stop offset="70%" stopColor="#d96570" />
                        <stop offset="100%" stopColor="#f49c4f" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="hidden md:flex flex-1 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-muted/40 border-primary/40 focus-visible:ring-primary/40 transition-all"
                    />
                </div>
                <AiSearch />
            </div>
        </>
    )
}

export default SearchInput
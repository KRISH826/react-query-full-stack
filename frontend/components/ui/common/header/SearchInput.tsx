import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../../input'

const SearchInput = () => {
    return (
        <>
            <div className="hidden md:flex flex-1 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-muted/40 border-primary/40 focus-visible:ring-primary/40!"
                    />
                </div>
            </div>

        </>
    )
}

export default SearchInput
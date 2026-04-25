import { useEffect, useState } from "react"
import { set } from "zod";


const KEY = "recent_searches"
const MAX = 5

export const useRecentSearches = () => {
    const [recents, Setrecents] = useState<string[]>([]);
    useEffect(() => {
        if (typeof window === undefined) return;
        try {
            const stored = localStorage.getItem(KEY);
            if (stored) {
                Setrecents(JSON.parse(stored));
            }
        } catch (error) {
            console.warn("Invalid localStorage data, clearing...")
            localStorage.removeItem(KEY)
        }
    }, []);

    const updateStorage = () => {
        localStorage.setItem(KEY, JSON.stringify(recents));
    }

    const addSearch = (query: string) => {
        const normalized = query.trim();
        if(!normalized) return;

        Setrecents((prev) => {
            const updated = [
                normalized,
                ...prev.filter((item) => item.toLocaleLowerCase() !== normalized.toLocaleLowerCase())
            ].slice(0, MAX);
            updateStorage();
            return updated;
        })
    }

    const removeSearch = (query: string) => {
        const normalized = query.trim();
        Setrecents((prev) => {
           const updated = prev.filter((item) => item.toLocaleLowerCase() !== normalized.toLocaleLowerCase());
           updateStorage();
           return updated
        })
    }

    const removeAllItem = () => {
        localStorage.removeItem(KEY);
        Setrecents([]);
    }

    return {
        recents,
        addSearch,
        removeSearch,
        removeAllItem
    }

}
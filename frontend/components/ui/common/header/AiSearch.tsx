'use client'

import React, { useId, useState } from 'react'
import { Sparkles, Send, Mic, Image as ImageIcon, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../../dialog'
import { Button } from '../../button'

const QUICK_PROMPTS = [
    { title: 'Find a perfect gift', desc: 'Curated ideas for upcoming events & holidays' },
    { title: 'Trending summer outfits', desc: 'Discover new styles and fresh fashion drops' },
    { title: 'Laptop recommendations', desc: 'Compare tech devices under a $1,000 budget' },
    { title: 'Compare smartwatches', desc: 'Find the best fitness tracking fit for your needs' },
]

const AiSearch = () => {
    const [query, setQuery] = useState('')
    const gradientId = useId().replace(/:/g, '')
    const gradientUrl = `url(#${gradientId})`

    const handleSend = () => {
        if (!query.trim()) return
        setQuery('')
        // TODO: wire send action with API when backend endpoint is ready.
    }

    return (
        <>
            <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285f4" />
                        <stop offset="30%" stopColor="#9b72cb" />
                        <stop offset="70%" stopColor="#d96570" />
                        <stop offset="100%" stopColor="#f49c4f" />
                    </linearGradient>
                </defs>
            </svg>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        className="group relative h-10 w-10 overflow-visible border-primary!"
                        size="icon"
                    >
                        <div className="relative flex items-center justify-center">
                            <Sparkles
                                className="h-4 w-4 transition-all duration-700 ease-in-out group-hover:rotate-180 group-hover:scale-125"
                                style={{ stroke: gradientUrl, fill: gradientUrl, fillOpacity: 0.2 }}
                                strokeWidth={1.5}
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-[#4285f4] via-[#9b72cb] to-[#f49c4f] blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-full scale-150" />
                        </div>
                    </Button>
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="relative m-0! flex h-dvh! w-screen! max-w-none! flex-col gap-0! overflow-hidden rounded-none! border-0! bg-background/95 p-0! shadow-none backdrop-blur-xl md:h-[92vh]! md:w-[92vw]! md:max-w-[1080px]! md:rounded-2xl! md:border md:shadow-2xl"
                >
                    <DialogTitle className="sr-only">AI Assistant Search</DialogTitle>

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/45 via-background to-background" />

                    <div className="relative flex h-full flex-col">
                        <div
                            className="z-10 shrink-0 border-b border-border/50 bg-background/85 px-4 pb-3 backdrop-blur-sm md:px-6 md:pb-4"
                            style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
                        >
                            <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/70">
                                        <Sparkles className="h-4.5 w-4.5" style={{ stroke: gradientUrl }} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground md:text-base">AI Assistant</p>
                                        <p className="text-xs text-muted-foreground">Fast answers, curated shopping help</p>
                                    </div>
                                </div>
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8">
                            <div className="mx-auto w-full max-w-3xl space-y-6 md:space-y-9">
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-3 text-center md:space-y-4">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 md:h-16 md:w-16">
                                        <Sparkles
                                            className="h-8 w-8 md:h-10 md:w-10"
                                            style={{ stroke: gradientUrl, fill: gradientUrl, fillOpacity: 0.1 }}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-3xl">
                                        How can I help you today?
                                    </h2>
                                    <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
                                        Ask me anything or tap one of these prompts to get started.
                                    </p>
                                </div>

                                <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both grid grid-cols-1 gap-2.5 duration-1000 delay-150 md:grid-cols-2 md:gap-3">
                                    {QUICK_PROMPTS.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setQuery(item.title)}
                                            className="group rounded-xl border border-border/60 bg-card/80 p-4 text-left shadow-xs transition-all hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm"
                                        >
                                            <span className="mb-1 block text-[15px] font-medium text-foreground">
                                                {item.title}
                                            </span>
                                            <span className="block text-[13px] leading-snug text-muted-foreground">
                                                {item.desc}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div
                            className="z-10 shrink-0 border-t border-border/50 bg-background/90 px-3 pt-2 backdrop-blur-sm md:px-6 md:pt-4"
                            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}
                        >
                            <div className="mx-auto w-full max-w-4xl">
                                <div className="relative flex items-end gap-1 rounded-2xl border border-input bg-background/85 p-2 shadow-xs">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                    <textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Message AI Assistant..."
                                        className="max-h-44 min-h-[42px] w-full flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSend()
                                            }
                                        }}
                                    />

                                    {!query.trim() && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                        >
                                            <Mic className="h-5 w-5" />
                                        </Button>
                                    )}
                                    <Button
                                        size="icon"
                                        disabled={!query.trim()}
                                        onClick={handleSend}
                                        className={`h-9 w-9 shrink-0 rounded-full transition-all ${query.trim()
                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        <Send className="ml-0.5 h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="mt-2 text-center text-[11px] text-muted-foreground md:text-xs">
                                    AI experiences can make mistakes. Verify critical information.
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AiSearch

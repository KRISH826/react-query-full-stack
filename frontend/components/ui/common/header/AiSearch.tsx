'use client'

import React, { useId, useState } from 'react'
import { Sparkles, Send, Mic, Image as ImageIcon, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '../../button'

const AiSearch = () => {
    const [query, setQuery] = useState('');
    const gradientId = useId().replace(/:/g, '')
    const gradientUrl = `url(#${gradientId})`

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="group border-primary! h-10 w-10 relative overflow-visible"
                    size="icon"
                >
                    <div className="relative flex items-center justify-center">
                            <Sparkles
                                className="h-4 w-4 text-[#6f56ff] transition-all duration-700 ease-in-out group-hover:rotate-180 group-hover:scale-125"
                                strokeWidth={1.8}
                            />
                        <div className="absolute inset-0 bg-linear-to-tr from-[#4285f4] via-[#9b72cb] to-[#f49c4f] blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-full scale-150" />
                    </div>
                </Button>
            </DialogTrigger>

            {/* Sleek, professional ChatGPT-like layout */}
            <DialogContent className="max-w-none! w-[95vw]! lg:w-[85vw]! h-[95vh]! m-0 p-0 overflow-hidden rounded-xl md:rounded-2xl border border-border shadow-2xl flex flex-col bg-background/95 backdrop-blur-xl sm:rounded-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 [&>button.absolute]:hidden">
                <DialogTitle className="sr-only">AI Assistant Search</DialogTitle>

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

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles
                            className="h-5 w-5"
                            style={{ stroke: "url(#geminiGradient)" }}
                        />
                        <span className="font-medium text-base text-foreground">
                            AI Assistant
                        </span>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </div>

                {/* Main Chat/Conversation Area */}
                <div className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-center p-6 md:p-8">
                    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center space-y-10">
                        {/* Hero Section */}
                        <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
                            <div className="flex items-center justify-center h-16 w-16 mb-2">
                                <Sparkles
                                    className="h-10 w-10 text-primary"
                                    style={{ stroke: "url(#geminiGradient)", fill: "url(#geminiGradient)", fillOpacity: 0.1 }}
                                    strokeWidth={1.5}
                                />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">
                                How can I help you today?
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Ask me anything or try an example below.
                            </p>
                        </div>

                        {/* Suggestion Chips */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
                            {[
                                { title: 'Find a perfect outfit', desc: 'Curated clothing ideas for events & holidays' },
                                { title: 'Trending summer outfits', desc: 'Discover new styles and fresh fashion drops' },
                                { title: 'Workwear recommendations', desc: 'Build polished office looks for your budget' },
                                { title: 'Compare denim styles', desc: 'Find the best jeans fit for your wardrobe' }
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setQuery(item.title)}
                                    className="group flex flex-col items-start p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-colors text-left shadow-xs hover:shadow-sm"
                                >
                                    <span className="font-medium text-[15px] text-foreground mb-1">
                                        {item.title}
                                    </span>
                                    <span className="text-[13px] text-muted-foreground leading-snug">
                                        {item.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ChatGPT Style Input Area */}
                <div className="shrink-0 py-5 bg-muted/20 relative z-10 border-t border-border/40 shadow-sm">
                    <div className="max-w-4xl sm:px-0 px-4 mx-auto">
                        <div className="relative flex items-end bg-background/20 backdrop-blur-md rounded-2xl border border-input focus:border-indigo-400 focus:ring-indigo-400 transition-all p-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0 rounded-full hidden sm:flex h-9 w-9">
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Message AI Assistant..."
                                className="flex-1 max-h-48 min-h-[36px] w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed shadow-none outline-none placeholder:text-muted-foreground transition-all"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (query.trim()) {
                                            setQuery('');
                                            // Handle send action
                                        }
                                    }
                                }}
                            />

                            <div className="flex items-center gap-2 shrink-0 px-1 pb-0.5">
                                {!query.trim() && (
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9">
                                        <Mic className="h-5 w-5" />
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    disabled={!query.trim()}
                                    className={`rounded-full h-9 w-9 transition-all ${query.trim()
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    <Send className="h-4 w-4 ml-0.5" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-[12px] text-center text-muted-foreground mt-3 font-medium">
                            AI experiences can make mistakes. Consider verifying important information.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AiSearch

'use client'

import React from 'react'
import { Sparkles, UserRound, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '../../button'
import Link from 'next/link'

const CheckProfile = () => {
    return (

        <DialogContent className="max-w-md! p-0 overflow-hidden rounded-2xl border border-border/60 shadow-2xl bg-background/95 backdrop-blur-xl [&>button.absolute]:hidden">
            <DialogTitle className="sr-only">Complete Your Profile</DialogTitle>

            {/* Gradient Header */}
            <div className="relative overflow-hidden px-6 pt-8 pb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-blue-500/10" />
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />

                <div className="relative flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 shadow-lg shadow-violet-500/10">
                        <UserRound className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-semibold text-foreground tracking-tight">
                            Complete Your Profile
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
                            Set up your profile to unlock personalized AI-powered product recommendations
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="px-6 pb-2 space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">AI Recommendations</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Get curated product suggestions based on your style and preferences</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">Smart Search</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Chat with our AI assistant and find exactly what you&apos;re looking for</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">Personalized Experience</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Your profile helps us understand your taste for better results</p>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="px-6 pt-2 pb-6">
                <DialogClose asChild>
                    <Link href="/profile">
                        <Button className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                            Complete Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </DialogClose>
                <p className="text-center text-[11px] text-muted-foreground/60 mt-3">
                    It only takes a minute to set up ✨
                </p>
            </div>
        </DialogContent>
    )
}

export default CheckProfile
'use client'

import React from 'react'
import { Sparkles, UserRound, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { DialogContent, DialogTitle } from '../../dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '../../button'
import Link from 'next/link'

const CheckProfile = () => {
    return (
        <DialogContent className="max-w-md! p-0 overflow-hidden rounded-2xl border border-border shadow-xl bg-background [&>button.absolute]:hidden">
            <DialogTitle className="sr-only">Complete Your Profile</DialogTitle>

            {/* Header */}
            <div className="px-6 pt-8 pb-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border border-primary/20">
                        <UserRound className="h-7 w-7 text-primary" />
                    </div>

                    <div className="space-y-1.5">
                        <h2 className="text-lg font-semibold text-foreground tracking-tight">
                            Complete Your Profile
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[300px]">
                            Set up your profile to unlock personalized AI-powered product recommendations
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Items */}
            <div className="px-6 pb-3 space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">AI Recommendations</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Get curated product suggestions based on your style</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">Smart Search</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Chat with our AI assistant to find what you need</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">Personalized Experience</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Your profile helps us understand your taste</p>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="px-6 pt-2 pb-6">
                <DialogClose asChild>
                    <Link href="/profile">
                        <Button className="w-full h-11 font-medium rounded-xl cursor-pointer">
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
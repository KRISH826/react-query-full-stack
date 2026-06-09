"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/branding/BrandLogo";

const Footer = () => {
    return (
        <footer className="border-t md:py-10 py-6 bg-secondary/30">
            <div className="container">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="space-y-5">
                        <BrandLogo showTagline={false} className="w-fit" />

                        <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                            Discover premium fashion crafted with elegance and comfort.
                            Elevate your everyday style with our latest collections.
                        </p>

                        {/* Social */}
                        <div className="flex items-center gap-3">
                            {[Facebook, Instagram, Twitter, Github].map((Icon, i) => (
                                <div
                                    key={i}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-background hover:bg-accent transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold tracking-wide mb-4">
                            Company
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Press</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold tracking-wide mb-4">
                            Support
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Shipping</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Returns</Link></li>
                            <li><Link href="#" className="hover:text-foreground">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-semibold tracking-wide mb-4">
                            Subscribe to our newsletter
                        </h4>

                        <p className="text-sm text-muted-foreground mb-4">
                            Get updates about new collections and exclusive offers.
                        </p>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter your email"
                                className="bg-background"
                            />
                            <Button>
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Zovara. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground">Terms</Link>
                        <Link href="#" className="hover:text-foreground">Cookies</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;

"use client";

import React from "react";
import { CheckCircle2, ArrowRight, ShoppingBag, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/services/orderApi";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const OrderSuccessPage = () => {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const { data: order, isLoading } = useGetOrderByIdQuery(orderId);

    const handleViewOrders = () => {
        router.push("/orders");
    };

    const handleContinueShopping = () => {
        router.push("/product");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Skeleton className="h-[500px] lg:col-span-2 rounded-3xl" />
                    <Skeleton className="h-[500px] lg:col-span-3 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Order not found.</p>
                    <Button onClick={() => router.push("/")}>Return Home</Button>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-stone-50/40 py-8 sm:py-12 flex items-center justify-center min-h-[75vh]">
            <div className="mx-auto max-w-[460px] w-full px-4">
                {/* Compact Premium Success Card */}
                <div className="bg-white rounded-3xl border border-stone-200/70 p-5 sm:p-6 shadow-sm flex flex-col space-y-5">

                    {/* Header: Icon & Confirmation Text */}
                    <div className="flex flex-col items-center text-center space-y-3.5">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/60">
                            <CheckCircle2 className="w-7 h-7 text-emerald-600 animate-pulse" />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                Order Confirmed
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                                Thank you for your order!
                            </h1>
                            <p className="text-xs text-stone-500 max-w-sm">
                                We've received your purchase and will notify you as soon as your items are shipped.
                            </p>
                        </div>
                    </div>
                    {/* Metadata Row: ID & Date */}
                    <div className="flex justify-between items-center bg-stone-50/60 border border-stone-100 rounded-xl p-3 text-xs text-stone-600">
                        <div>
                            <span className="font-semibold text-stone-400 block text-[9px] uppercase tracking-wider">Order ID</span>
                            <span className="font-mono font-bold text-stone-850">#{orderId?.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="text-right">
                            <span className="font-semibold text-stone-400 block text-[9px] uppercase tracking-wider">Date</span>
                            <span className="font-bold text-stone-850">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="space-y-2.5">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Items Summary</span>

                        <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-lg bg-stone-50 overflow-hidden border border-stone-150 shrink-0">
                                        <Image
                                            src={item.image_url || "/placeholder.png"}
                                            alt={item.productname}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-stone-800 truncate leading-snug">
                                            {item.productname}
                                        </p>
                                        <p className="text-[10px] text-stone-450 mt-0.5 font-semibold">
                                            {item.product_brand} • Qty {item.quantity} {item.size && `• Size ${item.size}`}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-stone-900">
                                            ₹{Number(item.offerPrice || item.price).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-stone-100/60" />

                    {/* Shipping Address */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Delivery Details</span>
                        <div className="flex items-start gap-2 text-xs text-stone-500 font-medium leading-relaxed">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-stone-400" />
                            <p>
                                {order.shippingaddress.shipping_address}, {order.shippingaddress.city}, {order.shippingaddress.state} {order.shippingaddress.postalcode}, {order.shippingaddress.country}
                            </p>
                        </div>
                    </div>

                    <Separator className="bg-stone-100/60" />

                    {/* Compact Pricing Block */}
                    <div className="bg-stone-50/80 border border-stone-100 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-stone-650">
                            <span className="font-semibold">Subtotal</span>
                            <span className="font-semibold">₹{Number(order.totalamount || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-stone-655">
                            <span className="font-semibold">Shipping</span>
                            <span className="font-semibold text-emerald-600 uppercase text-[9px] tracking-wider">Free</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-stone-200/50">
                            <span className="text-stone-900 font-bold text-xs sm:text-sm">Total Paid</span>
                            <span className="text-base font-black text-stone-900">
                                ₹{Number(order.totalamount || 0).toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1.5">
                        <Button
                            onClick={handleViewOrders}
                            className="flex-1 h-9.5 bg-stone-905 text-white hover:bg-stone-800 font-semibold text-xs sm:text-sm rounded-xl transition-all"
                        >
                            Track Order Status
                            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleContinueShopping}
                            className="flex-1 h-9.5 border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-semibold text-xs sm:text-sm rounded-xl transition-all"
                        >
                            <ShoppingBag className="mr-1.5 w-3.5 h-3.5" />
                            Continue Shopping
                        </Button>
                    </div>

                </div>

                {/* Bottom help text */}
                <p className="mt-5 text-center text-[10px] text-stone-400">
                    Need help? <a href="#" className="font-semibold text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-2">Contact Customer Support</a>
                </p>
            </div>
        </section>
    );
};

export default OrderSuccessPage;

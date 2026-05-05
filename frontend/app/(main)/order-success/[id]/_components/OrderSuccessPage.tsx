"use client";

import React from "react";
import { CheckCircle2, ArrowRight, ShoppingBag, Package, Truck, Calendar, MapPin, ReceiptText } from "lucide-react";
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
        router.push("/categories");
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
        <div className="min-h-screen bg-stone-50/80 flex flex-col items-center justify-center p-4 sm:p-8">
            {/* Main Premium Container */}
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200">
                
                {/* LEFT SIDE: Success Banner & Actions (Dark/Vibrant Theme) */}
                <div className="lg:col-span-2 bg-zinc-950 relative p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
                    {/* Background glow effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] bg-emerald-500/20 blur-[100px] rounded-full" />
                        <div className="absolute -bottom-[20%] -left-[20%] w-[70%] h-[70%] bg-blue-500/20 blur-[100px] rounded-full" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 mt-4 lg:mt-0">
                        {/* Animated Icon */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center relative z-10 border border-emerald-500/20">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            </div>
                            <div className="absolute inset-0 rounded-full ring-4 ring-emerald-400/30 animate-ping opacity-20" />
                            <div className="absolute inset-[-10px] rounded-full border border-emerald-500/20 animate-[spin_4s_linear_infinite]" />
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Payment Successful
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
                                Order <br className="hidden lg:block" />
                                Confirmed.
                            </h1>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                Thank you for your purchase! We've received your order and are currently processing it for shipment.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="relative z-10 space-y-3 mt-12 lg:mt-24">
                        <Button
                            onClick={handleViewOrders}
                            className="w-full h-14 bg-white text-zinc-950 hover:bg-stone-100 font-bold text-sm rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Track Order Status
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleContinueShopping}
                            className="w-full h-14 bg-transparent border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 font-semibold text-sm rounded-xl transition-all"
                        >
                            <ShoppingBag className="mr-2 w-4 h-4" />
                            Continue Shopping
                        </Button>
                    </div>
                </div>

                {/* RIGHT SIDE: Order Details */}
                <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col">
                    <div className="flex items-center gap-2 text-muted-foreground mb-8">
                        <ReceiptText className="w-5 h-5" />
                        <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
                    </div>

                    {/* Order Meta Info */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Package className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Order ID</span>
                            </div>
                            <p className="text-sm font-mono font-bold text-foreground">
                                #{orderId?.slice(-8).toUpperCase()}
                            </p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Date</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground mb-4">Items Ordered</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 group">
                                    <div className="relative w-16 h-16 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                                        <Image
                                            src={item.image_url || "/placeholder.png"}
                                            alt={item.productname}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {item.product_brand}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {item.productname}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">
                                            ₹{Number(item.offerPrice || item.price).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-8 bg-stone-100" />

                    {/* Shipping & Total Footer */}
                    <div className="grid sm:grid-cols-2 gap-8 items-end">
                        {/* Shipping Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-foreground">
                                <Truck className="w-4 h-4" />
                                <span className="text-sm font-bold">Shipping Details</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="leading-relaxed">
                                    {order.shippingaddress.shipping_address}<br />
                                    {order.shippingaddress.city}, {order.shippingaddress.state} {order.shippingaddress.postalcode}<br />
                                    {order.shippingaddress.country}
                                </p>
                            </div>
                        </div>

                        {/* Total Block */}
                        <div className="bg-zinc-950 p-6 rounded-2xl text-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-400 text-sm font-medium">Subtotal</span>
                                <span className="font-semibold text-sm">₹{Number(order.totalamount || 0).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
                                <span className="text-zinc-400 text-sm font-medium">Shipping</span>
                                <span className="font-semibold text-sm text-emerald-400">Free</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold">Total Paid</span>
                                <span className="text-2xl font-black text-emerald-400">
                                    ₹{Number(order.totalamount || 0).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Bottom help text */}
            <p className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                Need help with your order? <a href="#" className="font-semibold text-foreground hover:underline">Contact Support</a>
            </p>
        </div>
    );
};

export default OrderSuccessPage;

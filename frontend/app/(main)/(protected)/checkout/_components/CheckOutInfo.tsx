"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentSuccessDialog } from "@/components/payment/PaymentSuccessDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useOrderPolling } from "@/hooks/usePolling"
import { useRazorpay } from "@/hooks/useRazorpay"
import { CheckOutSchema, checkOutSchema } from "@/schema/checkout.schema"
import { useBuyNowOrderMutation, useCheckOutMutation } from "@/services/orderApi"
import { useGetCartQuery } from "@/services/cartApi"
import { useGetProfileQuery } from "@/services/userApi"
import { CreditCard, Mail, Phone } from "lucide-react"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

const CheckOutInfo = () => {
    const [checkout] = useCheckOutMutation();
    const searchParams = useSearchParams();
    const { startPolling, order } = useOrderPolling()
    const { initiatePayment, isSuccessOpen, successData, closeSuccess } = useRazorpay()
    const paymentStartedForOrderIdRef = useRef<string | null>(null)
    const token = useSelector((state: RootState) => state.auth.accessToken)
    const isBuyNow = searchParams.has("productId");
    const { data: cart } = useGetCartQuery(undefined, { skip: !token || isBuyNow })
    const quantity = Number(searchParams.get("quantity") ?? 1);
    const unitPrice = Number(searchParams.get("amount") ?? 0);
    const buyNowParams = {
        productId: searchParams.get("productId") ?? "",
        variantId: searchParams.get("variantId") ?? "",
        quantity: Number(searchParams.get("quantity") ?? 1),
        amount: String(unitPrice * quantity),  // ← pass total
    }
    const isCartEmpty = !isBuyNow && (cart?.items?.length ?? 0) === 0
    const [buyNowOrder] = useBuyNowOrderMutation();

    const { data: user } = useGetProfileQuery(undefined, {
        skip: !token,
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckOutSchema>({
        resolver: zodResolver(checkOutSchema),
        values: {
            shippingAddress: {
                shipping_address: user?.address || "",
                city: user?.city || "",
                state: "",
                postalcode: user?.postcode || "",
                country: user?.country || "",
            },
            phone: "",
            email: user?.email || "",
        },
    })

    const onSubmit = async (data: CheckOutSchema) => {
        try {
            let response;

            if (isBuyNow) {
                response = await buyNowOrder({
                    ...data,
                    productId: buyNowParams.productId,
                    variant_id: buyNowParams.variantId,
                    quantity: buyNowParams.quantity,
                }).unwrap();
            } else {
                response = await checkout(data).unwrap();
            }

            const order = response.order;

            await initiatePayment({
                orderId: order.id,
                amount: order.totalamount,
                userName: order.shippingaddress.shipping_address,
                userEmail: order.email || "",
                userPhone: order.phone,
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to place order");
        }
    };
    return (
        <div className="mx-auto w-full">
            <form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
                <div className="space-y-6 lg:col-span-12">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="flex-1">
                                <CardTitle className="text-xl">Shipping Address</CardTitle>
                                <CardDescription>Where should we deliver your order?</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Field>
                                <FieldLabel htmlFor="shippingAddress.shipping_address">Street Address</FieldLabel>
                                <Input
                                    id="shippingAddress.shipping_address"
                                    placeholder="Room No, Building Name, Street"
                                    {...register("shippingAddress.shipping_address")}
                                    aria-invalid={!!errors.shippingAddress?.shipping_address}
                                />
                                <FieldError errors={[errors.shippingAddress?.shipping_address]} />
                            </Field>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="shippingAddress.city">City</FieldLabel>
                                    <Input
                                        id="shippingAddress.city"
                                        placeholder="City Name"
                                        {...register("shippingAddress.city")}
                                        aria-invalid={!!errors.shippingAddress?.city}
                                    />
                                    <FieldError errors={[errors.shippingAddress?.city]} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="shippingAddress.state">State / Province</FieldLabel>
                                    <Input
                                        id="shippingAddress.state"
                                        placeholder="State"
                                        {...register("shippingAddress.state")}
                                        aria-invalid={!!errors.shippingAddress?.state}
                                    />
                                    <FieldError errors={[errors.shippingAddress?.state]} />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="shippingAddress.postalcode">Postal Code</FieldLabel>
                                    <Input
                                        id="shippingAddress.postalcode"
                                        placeholder="123456"
                                        {...register("shippingAddress.postalcode")}
                                        aria-invalid={!!errors.shippingAddress?.postalcode}
                                    />
                                    <FieldError errors={[errors.shippingAddress?.postalcode]} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="shippingAddress.country">Country</FieldLabel>
                                    <Input
                                        id="shippingAddress.country"
                                        placeholder="Country"
                                        {...register("shippingAddress.country")}
                                        aria-invalid={!!errors.shippingAddress?.country}
                                    />
                                    <FieldError errors={[errors.shippingAddress?.country]} />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="flex-1">
                                <CardTitle className="text-xl">Contact Information</CardTitle>
                                <CardDescription>How can we reach you regarding your order?</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-0!">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <div className="flex items-center gap-2">
                                        <Mail className="text-muted-foreground size-4" />
                                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        {...register("email")}
                                        aria-invalid={!!errors.email}
                                    />
                                    <FieldError errors={[errors.email]} />
                                </Field>
                                <Field>
                                    <div className="flex items-center gap-2">
                                        <Phone className="text-muted-foreground size-4" />
                                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                    </div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 00000 00000"
                                        {...register("phone")}
                                        aria-invalid={!!errors.phone}
                                    />
                                    <FieldError errors={[errors.phone]} />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="rounded-2xl border border-dashed p-6 text-center">
                        <div className="bg-amber-500/10 text-amber-500 mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
                            <CreditCard className="size-6" />
                        </div>
                        <h3 className="font-semibold italic font-mono uppercase">Cash on Delivery Available</h3>
                        <p className="text-muted-foreground text-sm">
                            Online payment methods will be integrated soon. For now, we only support COD.
                        </p>
                    </div>
                </div>
            </form>

            {successData && (
                <PaymentSuccessDialog
                    isOpen={isSuccessOpen}
                    onClose={closeSuccess}
                    orderId={successData.orderId}
                    amount={successData.amount}
                />
            )}
        </div>
    )
}

export default CheckOutInfo

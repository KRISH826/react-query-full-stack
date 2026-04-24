"use client"

import { useCheckOutMutation, useGetOrderJobStatusQuery } from "@/services/orderApi"
import { CheckOutSchema, checkOutSchema } from "@/schema/checkout.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Phone, Mail, CreditCard } from "lucide-react"
import { useGetProfileQuery } from "@/services/userApi"

const CheckOutInfo = () => {
    const [checkout] = useCheckOutMutation();
    const [getOrderJobStatus]  = useGetOrderJobStatusQuery();
    const { data: user } = useGetProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CheckOutSchema>({
        resolver: zodResolver(checkOutSchema),
        defaultValues: {
            shippingAddress: {
                shipping_address: user?.address || "",
                city: user?.city || "",
                state: "",
                postalcode: user?.postcode || "",
                country: user?.country || ""
            },
            phone: "",
            email: user?.email || ""
        }
    })

    const onSubmit = async (data: CheckOutSchema) => {
        try {
            const response = await checkout(data).unwrap()
            // Dispatch custom event to trigger Razorpay in OrderSummary
            const event = new CustomEvent("ORDER_CREATED", {
                detail: {
                    order: response.order,
                    userData: {
                        name: data.shippingAddress.shipping_address.split(',')[0], // Extract a name if possible or just use address
                        email: data.email,
                        phone: data.phone
                    }
                }
            })
            window.dispatchEvent(event)
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to place order. Please try again."
            toast.error(errorMessage)
        }
    }

    return (
        <div className="mx-auto w-full">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-12">
                    {/* Shipping Address Section */}
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
                    {/* Contact Information Section */}
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
                    {/* Payment Info Overlay/Note */}
                    <div className="rounded-2xl border border-dashed p-6 text-center">
                        <div className="bg-amber-500/10 text-amber-500 mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
                            <CreditCard className="size-6" />
                        </div>
                        <h3 className="font-semibold italic font-mono uppercase">Cash on Delivery Available</h3>
                        <p className="text-muted-foreground text-sm">Online payment methods will be integrated soon. For now, we only support COD.</p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CheckOutInfo

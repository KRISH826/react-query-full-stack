
import React from 'react'
import OrderSummary from '../carts/_components/OrderSummary'
import CheckOutInfo from './_components/CheckOutInfo'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
const page = () => {
    return (
        <section className="py-8">
            <div className="container">
                <div className="heading flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                            Checkout
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Review your items before checkout.
                        </p>
                    </div>
                    <Button variant={"outline"} className='cursor-pointer w-full sm:w-auto'>
                        <Link className='flex items-center justify-center gap-2' href={"/carts"}>
                            <ArrowLeft /> Back to Cart
                        </Link>
                    </Button>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CheckOutInfo />
                    </div>
                    {/* RIGHT SIDE - ORDER SUMMARY */}
                    <OrderSummary />
                </div>
            </div>
        </section>
    )
}

export default page
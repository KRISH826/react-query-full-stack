import React from 'react'
import OrderSummary from '../carts/_components/OrderSummary'

const page = () => {
    return (
        <section className="py-8">
            <div className="container">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Your Cart
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review your items before checkout.
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    HI
                    {/* RIGHT SIDE - ORDER SUMMARY */}
                    <OrderSummary />
                </div>
            </div>
        </section>
    )
}

export default page
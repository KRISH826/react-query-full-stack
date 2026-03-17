"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

const ProductReviews = () => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Write a Review
                </Button>
            </div>
        </>
    )
}

export default ProductReviews
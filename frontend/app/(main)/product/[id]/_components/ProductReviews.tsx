"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useGetProductReviewsQuery } from '@/services/reviewApi'
import { useGetProfileQuery } from '@/services/userApi'
import { BsStar } from "react-icons/bs"
import ProductRating from '../../_components/ProductRating'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import ReviewFormDialog from './ReviewFormDialog'

const ProductReviews = () => {
    const params = useParams();
    const id = params.id as string;
    
    const { data: userProfile } = useGetProfileQuery();
    const { data: reviewsData, isLoading } = useGetProductReviewsQuery({ productId: id });

    return (
        <div className="border-t border-slate-100 pt-8 mt-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ratings & Reviews</h2>
                    {reviewsData?.reviewStats && (
                        <div className="mt-2 flex items-center gap-3">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tighter">
                                {Number(reviewsData.reviewStats.avg_rating).toFixed(1)}
                            </span>
                            <div className="flex flex-col">
                                <ProductRating rating={Number(reviewsData.reviewStats.avg_rating)} size={14} />
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{reviewsData.reviewStats.total_reviews} reviews</span>
                            </div>
                        </div>
                    )}
                </div>

                <ReviewFormDialog productId={id} />
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner className="w-8 h-8 text-primary" />
                    </div>
                ) : reviewsData?.reviews?.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <BsStar size={18} className="text-slate-300" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight">No reviews yet</h3>
                        <p className="text-[12px] text-slate-500 mt-1">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {reviewsData?.reviews?.map((review) => {
                            const isCurrentUser = userProfile?.id === review.user_id;
                            const displayName = isCurrentUser ? "You" : (review.user?.name || "Verified Customer");
                            const initials = (review.user?.name || "V")
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 1);

                            return (
                                <div 
                                    key={review.id} 
                                    className={cn(
                                        "p-4 rounded-xl bg-white border border-slate-100/80 transition-all hover:border-slate-200/50 hover:shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]",
                                        isCurrentUser && "bg-slate-50/30 border-primary/10"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black transition-colors shrink-0 shadow-sm",
                                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <p className="font-bold text-slate-800 text-sm truncate uppercase tracking-wide">{displayName}</p>
                                                    {isCurrentUser && (
                                                        <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-tighter">
                                                            Owner
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="shrink-0 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <ProductRating rating={Number(review.rating)} size={11} />
                                            </div>
                                            <p className="mt-2 text-slate-600 text-[13px] leading-relaxed font-medium">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductReviews;
"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { BsFillStarFill, BsStar } from "react-icons/bs"
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useAddReviewMutation } from '@/services/reviewApi'

const STAR_COLOR = "#FF9900";

interface ReviewFormDialogProps {
    productId: string;
}

const ReviewFormDialog = ({ productId }: ReviewFormDialogProps) => {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (comment.trim() === "") {
            toast.error("Please enter a review comment");
            return;
        }

        try {
            await addReview({
                product_id: productId,
                rating,
                comment: comment.trim()
            }).unwrap();

            toast.success("Review submitted successfully!");
            setOpen(false);
            setRating(0);
            setComment("");
        } catch {
            toast.error("Failed to submit review");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 h-10 transition-all rounded-lg text-sm">
                    Write a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-105 p-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <DialogHeader className="p-5 flex flex-col gap-1 border-b border-slate-100 bg-white">
                    <DialogTitle className="text-lg mb-0 font-bold text-slate-900">Write your review</DialogTitle>
                    <DialogDescription className="text-slate-500 text-xs mt-0.5">
                        Share your brand experience with other shoppers.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-5 space-y-5 bg-white">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall rating</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    {(hover || rating) >= star ? (
                                        <BsFillStarFill size={28} color={STAR_COLOR} />
                                    ) : (
                                        <BsStar size={28} className="text-slate-200" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Add a written review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike? How was the quality?"
                            className="w-full min-h-[120px] rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all resize-none bg-slate-50/30 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="pt-1">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner className="w-4 h-4 mr-2" /> : null}
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ReviewFormDialog;

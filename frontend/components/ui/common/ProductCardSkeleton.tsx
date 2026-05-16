"use client";

const ProductCardSkeleton = () => {
    return (
        <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-xl md:rounded-2xl border bg-white shadow-sm">
            <div className="aspect-square w-full bg-gray-200" />
            <div className="flex flex-1 flex-col p-3 md:p-4">
                <div className="h-4 w-24 rounded bg-gray-200 md:h-5" />
                <div className="mt-2 h-3 w-40 rounded bg-gray-200 md:h-4" />
                <div className="mt-3 flex gap-1">
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                </div>
                <div className="flex-1" />
                <div className="mt-4 h-5 w-28 rounded bg-gray-200" />
                <div className="mt-4 flex items-center gap-2">
                    <div className="h-9 w-9 rounded-md bg-gray-200" />
                    <div className="h-9 flex-1 rounded-md bg-gray-200 md:h-10" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
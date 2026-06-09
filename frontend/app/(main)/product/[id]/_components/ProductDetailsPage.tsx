"use client"
import { useGetProductByIdQuery } from '@/services/productApi';
import { useParams } from 'next/navigation'
import ImageGallery from './ImageGallery';
import ProductContent from './ProductContent';
import { Spinner } from '@/components/ui/spinner';
import ProductReviews from './ProductReviews';

const ProductDetailsPage = () => {
    const params = useParams();
    const id = params.id as string;
    const { data, isLoading, error } = useGetProductByIdQuery(id, {
        skip: !id
    });

    if (isLoading) return <div className='flex items-center justify-center h-[45vh]'>
        <Spinner className='size-12' />
    </div>;
    if (error || !data) return <div className='flex items-center justify-center'>Error loading product.</div>;

    return (
        <div>
            <div className="container mx-auto">
                <div className='grid grid-cols-1 items-start gap-8 md:grid-cols-[45%_55%]'>
                    <div className='lg:sticky lg:top-24 self-start'>
                        <ImageGallery images={data.images || []} productId={data.id} />
                    </div>
                    <div>
                        <ProductContent product={data} />
                    </div>
                </div>
                <div className='mt-12'>
                    <ProductReviews />
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage

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
    const { data, isLoading, error } = useGetProductByIdQuery(id);
    console.log(data);

    if (isLoading) return <div className='flex items-center justify-center h-[45vh]'>
        <Spinner className='size-12' />
    </div>;
    if (error || !data) return <div className='flex items-center justify-center'>Error loading product.</div>;

    return (
        <div>
            <div className="container mx-auto">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div>
                        <ImageGallery images={data.images || []} />
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
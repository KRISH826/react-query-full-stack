"use client"
import { useParams, useSearchParams } from 'next/navigation'
import { useGetProductsByCategoriesQuery } from '@/services/categoryApi';

const CategoryPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const slug = searchParams?.get('slug');

    const { data } = useGetProductsByCategoriesQuery({
        categoryId: id,   // from URL params
        slug: slug || "",       // from URL params
        limit: 30,
        page: 1,
    });

    console.log(data);
    return (
        <div className=''>
            <div className='container mx-auto'>

            </div>
        </div>
    )
}

export default CategoryPage
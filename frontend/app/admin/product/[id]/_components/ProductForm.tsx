"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import productSchema, { ProductFormSubmitValues, ProductFormValues } from '@/schema/product.schema';
import { useCreateProductMutation } from '@/services/productApi';
import { useGetAllCategoriesQuery } from '@/services/categoryApi';
import { ProductStatus } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BasicInfo } from './BasicInfo';
import ProductImage from './ProductImage';
import ProductVariants from './ProductVariants';

const ProductForm = () => {
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { data: categories } = useGetAllCategoriesQuery();
    const form = useForm<ProductFormValues, unknown, ProductFormSubmitValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productname: '',
            description: '',
            brand: '',
            gender: 'UNISEX',
            status: ProductStatus.DRAFT,
            is_track_inventory: true,
            category_names: [],
            images: [],
            variants: [{ sku: "", size: "M", price_override: null, offer_price_override: null, stock_quantity: null }] // fix #3
        }
    })

    const onSubmit = async (data: ProductFormSubmitValues) => {
        try {
            const formData = new FormData();
            formData.append('productname', data.productname);
            formData.append('description', data.description);
            if (data.brand) formData.append('brand', data.brand);
            formData.append('gender', data.gender);
            formData.append('status', data.status);
            formData.append('is_track_inventory', String(data.is_track_inventory));
            data.category_names.forEach((name) => {
                const original = categories?.find(
                    (c) => c.name.toLowerCase() === name.toLowerCase()
                )?.name ?? name;
                formData.append('category_names', original);
            });
            formData.append('variants', JSON.stringify(data.variants));
            const sortedImages = [...data.images].sort((a, b) => {
                if (a.isprimary && !b.isprimary) return -1;
                if (!a.isprimary && b.isprimary) return 1;
                return 0;
            });
            sortedImages.forEach((img) => {
                formData.append('images', img.file);
            });
            await createProduct(formData).unwrap();
            toast.success('Product created successfully!');
            router.push('/admin/product');
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product.');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex justify-between items-center gap-4'>
                    <h1 className='text-2xl font-semibold'>Create Product</h1>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Product'}
                    </Button>
                </div>
                <Card className='lg:mt-6 space-y-5 mt-4'>
                    <BasicInfo form={form} />
                    <ProductImage form={form} />
                    <ProductVariants form={form} />
                </Card>
            </form>
        </Form>
    )
}

export default ProductForm
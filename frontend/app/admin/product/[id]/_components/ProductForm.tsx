"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import productSchema, { ProductFormSubmitValues, ProductFormValues } from '@/schema/product.schema';
import { useCreateProductMutation } from '@/services/productApi';
import { ProductStatus } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BasicInfo } from './BasicInfo';

const ProductForm = () => {
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const form = useForm<ProductFormValues, unknown, ProductFormSubmitValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productname: '',
            description: '',
            brand: '',
            gender: 'UNISEX',
            status: ProductStatus.DRAFT,
            is_track_inventory: true,
            category_ids: [],
            images: [],
            variants: [{ size: "M", price_override: 0, stock_quantity: 0 }]
        }
    })
    const onSubmit = async (data: ProductFormSubmitValues) => {
        try {
            const formData = new FormData();
            formData.append('productname', data.productname);
            formData.append('description', data.description);
            formData.append('brand', data.brand || '');
            formData.append('gender', data.gender);
            formData.append('status', data.status);
            formData.append('is_track_inventory', data.is_track_inventory ? "true" : "false");
            formData.append('category_ids', JSON.stringify(data.category_ids));
            formData.append('variants', JSON.stringify(data.variants));
            data.images.forEach((img, index) => {
                formData.append(`images[${index}][file]`, img.file);
                formData.append(`images[${index}][isprimary]`, img.isprimary ? "true" : "false");
            });
            await createProduct(formData).unwrap();
            router.push('/admin/product');
            toast.success('Product created successfully!');
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
                <Card className='lg:mt-6 mt-4'>
                    <BasicInfo form={form} />
                </Card>
            </form>
        </Form>
    )
}

export default ProductForm

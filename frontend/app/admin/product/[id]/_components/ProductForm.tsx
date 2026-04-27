"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import productSchema, { ProductFormSubmitValues, ProductFormValues } from '@/schema/product.schema';
import { useCreateProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from '@/services/productApi';
import { useGetAllCategoriesQuery } from '@/services/categoryApi';
import { ProductStatus, ProductVariant } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BasicInfo } from './BasicInfo';
import ProductImage from './ProductImage';
import ProductVariants from './ProductVariants';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const ProductForm = ({ productId }: { productId?: string }) => {
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isLoadingUpdate }] = useUpdateProductMutation();
    const isEditMode = !!productId;
    const { data: existingProduct, isLoading: isLoadingProduct } = useGetProductByIdQuery(productId!, {
        skip: !productId
    });
    const { data: categories } = useGetAllCategoriesQuery();
    // const [loadingMessage, setLoadingMessage] = useState('Creating Product...');
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
            variants: [{ sku: "", size: "M", price_override: null, offer_price_override: null, stock_quantity: null }]
        }
    })

    console.log('gender is', existingProduct?.gender);
    console.log('status is', existingProduct?.status);

    useEffect(() => {
        if (existingProduct) {
            form.reset({
                productname: existingProduct.productname || '',
                description: existingProduct.description || '',
                brand: existingProduct.brand || '',
                gender: existingProduct.gender,
                status: existingProduct.status || ProductStatus.DRAFT,
                is_track_inventory: existingProduct.is_track_inventory ?? true,
                category_names: existingProduct.categories?.map((c) => c.name) || [],
                // Map variants to remove extra properties like id, product_id, etc.
                variants: existingProduct.variants?.length
                    ? existingProduct.variants.map((v: ProductVariant) => ({
                        sku: v.sku ?? "",
                        size: v.size ?? "M",
                        price_override: v.price_override ?? null,
                        offer_price_override: v.offer_price_override ?? null,
                        stock_quantity: v.stock_quantity ?? null,
                    }))
                    : [{ sku: "", size: "M", price_override: null, offer_price_override: null, stock_quantity: null }],
                images: existingProduct.images?.length
                    ? existingProduct.images.map((img) => ({
                        id: img.id,
                        file: null,
                        url: img.image_url,
                        isprimary: img.isprimary
                    }))
                    : []
            })
        }
    }, [existingProduct, form, isEditMode])

    if (isEditMode && isLoadingProduct) {
        return <Card className="flex items-center rounded-lg w-full bg-white justify-center h-[calc(100vh-120px)] text-muted-foreground">
            <div className='flex items-center gap-2'>
                <Spinner className='w-10 h-10' />
                <span className='ml-2 text-lg!'>Loading product data...</span>
            </div>
        </Card>
    }

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
            if (isEditMode && productId) {
                await updateProduct({ id: productId, data: formData }).unwrap();
                toast.success('Product updated successfully!');
            } else {
                await createProduct(formData).unwrap();
                toast.success('Product created successfully!');
            }
            router.push('/admin/product');
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to create product.";
            toast.error(errorMessage);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex justify-between items-center gap-4'>
                    <h1 className='text-2xl font-semibold'>{isEditMode ? 'Update Product' : 'Create Product'}</h1>
                    <div className='flex items-center gap-2'>
                        <Button type="button" variant="outline" className='cursor-pointer' onClick={() => router.push('/admin/product')}>
                            <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
                        </Button>
                        <Button type="submit" disabled={isLoading} className='cursor-pointer'>
                            {
                                isEditMode ? (
                                    isLoadingUpdate ? <>
                                        <Spinner className='w-4 h-4' /> Updating Product...
                                    </> : 'Update Product'
                                ) : (
                                    isLoading ? <>
                                        <Spinner className='w-4 h-4' /> Creating Product...
                                    </> : 'Create Product'
                                )
                            }
                        </Button>
                    </div>
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

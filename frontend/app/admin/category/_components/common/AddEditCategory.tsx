
"use client";
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CategoryFormSchema } from '@/schema/category.schema';
import { useCreateCategoryMutation, useGetAllCategoriesQuery, useGetCategoriesByIdQuery, useUpdateCategoryMutation } from '@/services/categoryApi'
import { Category } from '@/types/category'
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { set } from 'zod';

type props = {
    initialData?: Category | null;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}

const AddEditCategory = ({ initialData, onOpenChange, open }: props) => {
    const isEditMode = !!initialData; // Agar initial data nahi hai, toh add mode hai, warna edit mode
    const { data: categories } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const form = useForm<CategoryFormSchema>({
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            is_parent: initialData?.is_parent || false,
            parent_id: initialData?.parent_id || null,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                slug: initialData.slug,
                is_parent: initialData.parent_id == null,
                parent_id: initialData.parent_id,
            });
        } else {
            form.reset({ name: "", slug: "", is_parent: true, parent_id: null });
        }
    }, [initialData]);

    const onSubmit = async (values: CategoryFormSchema) => {
        try {
            if (isEditMode && initialData) {
                await updateCategory({ id: initialData.id, data: values }).unwrap();

                toast.success("Category updated successfully");
            }
            else {
                await createCategory(values).unwrap();
                toast.success("Category created successfully");
            }
        } catch (error) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to create Category.";
            toast.error(errorMessage);
        }
        finally {
            onOpenChange(false); // Modal close kar do
            form.reset(); // Form reset kar do
        }

    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Smartphones" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_parent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Root Category</FormLabel>
                                        <FormDescription>Is this a top-level category?</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {
                            !form.watch("is_parent") && (
                                <FormField
                                    control={form.control}
                                    name="parent_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a parent category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map((cat: Category) => (
                                                        // Prevent selecting itself as parent in Edit mode
                                                        cat.id !== initialData?.id && (
                                                            <SelectItem key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        )
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        <div className="flex items-center justify-end gap-2">
                            <Button type='button' variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? "Update Category" : "Create Category"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddEditCategory
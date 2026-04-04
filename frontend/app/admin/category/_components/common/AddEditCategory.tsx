
"use client";
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useCreateCategoryMutation, useGetAllCategoriesQuery, useGetCategoriesByIdQuery } from '@/services/categoryApi'
import { Category } from '@/types/category'

type props = {
    isInitialData?: Category | null;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}

const AddEditCategory = ({ isInitialData, onOpenChange, open }: props) => {
    const isEditMode = !isInitialData; // Agar initial data nahi hai, toh add mode hai, warna edit mode
    const queryClient = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const { data, isLoading } = useGetCategoriesByIdQuery(isInitialData?.id!, {
        skip: !isEditMode,
    });
    // const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
                </DialogHeader>
                <Form >
                    <form className="space-y-5">
                        
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddEditCategory
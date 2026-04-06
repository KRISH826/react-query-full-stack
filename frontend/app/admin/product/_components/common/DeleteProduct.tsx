"use client"
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { useDeleteProductMutation } from '@/services/productApi'
import React from 'react'
import { toast } from 'sonner'

type props = {
    id: string | number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeleteProduct = ({ id, open, onOpenChange }: props) => {
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDelete = async () => {
        try {
            await deleteProduct(id).unwrap();
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product and remove all associated data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={isLoading} className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                    {
                        isLoading ? "Deleting..." : "Delete"
                    }
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
  )
}

export default DeleteProduct

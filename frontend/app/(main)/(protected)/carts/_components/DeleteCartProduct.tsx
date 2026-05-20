"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteCartMutation } from "@/services/cartApi";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteCartProductProps {
    id: string;
    productName?: string;
}

const DeleteCartProduct = ({ id, productName }: DeleteCartProductProps) => {
    const [deleteCartProduct, { isLoading }] = useDeleteCartMutation();

    const handleDeleteProduct = async () => {
        try {
            await deleteCartProduct({ variant_id: id }).unwrap();
            toast.success("Item removed from cart.");
        } catch (error) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to remove the cart item.";
            toast.error(errorMessage);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                    aria-label="Remove cart item"
                >
                    <Trash2 className="size-4" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove this item?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {productName
                            ? `${productName} will be removed from your cart. You can always add it again later.`
                            : "This item will be removed from your cart. You can always add it again later."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Keep item</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteProduct}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        {isLoading ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Removing...
                            </span>
                        ) : (
                            "Remove item"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteCartProduct;

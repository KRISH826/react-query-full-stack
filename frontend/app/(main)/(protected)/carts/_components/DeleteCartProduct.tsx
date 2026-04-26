import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useDeleteCartMutation } from '@/services/cartApi'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type cart = {
    id: string
}

const DeleteCartProduct = ({ id }: cart) => {
    const [deleteCartProduct, { isLoading }] = useDeleteCartMutation();
    const handleDeleteProduct = async () => {
        try {
            await deleteCartProduct({ variant_id: id });
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Login failed";
            toast.error(errorMessage);
        } finally {
            toast.success("Cart Item Deleted SuccessFully")
        }

    }
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className="text-red-500 p-1 cursor-pointer hover:text-red-600 transition">
                        <Trash2 size={24} />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct}>
                            {
                                isLoading ? "Deleting..." : "Continue"
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DeleteCartProduct
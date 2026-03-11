import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useRemoveFavouriteMutation } from '@/services/favouriteApi';
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner';

type DeleteDialogProps = {
    productId: string;
}

const DeleteDialog = ({ productId }: DeleteDialogProps) => {
    const [removeFavourite, { isLoading }]= useRemoveFavouriteMutation();  
    const handleDeleteFavorites = async () => {
        try {
            await removeFavourite({ productId }).unwrap();
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error deleting favorite item:", error);
            toast.error("Failed to remove item");
        }// Implement the logic to delete the favorite item here
    }
  return (
    <>
        <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="text-red-500 p-1 cursor-pointer absolute right-3 top-3 flex h-8 w-8 items-center justify-center hover:text-red-600 transition">
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
                            <AlertDialogAction onClick={handleDeleteFavorites}>
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

export default DeleteDialog
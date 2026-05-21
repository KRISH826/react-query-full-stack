import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useRemoveFavouriteMutation } from '@/services/favouriteApi';
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type DeleteDialogProps = {
    productId: string;
}

const DeleteDialog = ({ productId }: DeleteDialogProps) => {
    const [removeFavourite, { isLoading }] = useRemoveFavouriteMutation();
    
    const handleDeleteFavorites = async () => {
        try {
            await removeFavourite({ productId }).unwrap();
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error deleting favorite item:", error);
            toast.error("Failed to remove item");
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700 cursor-pointer"
                >
                    <Trash2 className="size-4.5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove from Wishlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove the item from your saved favourites. You can always add it back later from the shop.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDeleteFavorites}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                    >
                        {isLoading ? "Removing..." : "Remove"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog

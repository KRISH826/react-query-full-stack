"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useCancelOrderItemsMutation } from "@/services/orderApi";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
// shadcn dialog
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

export const DeleteAction = ({ orderId, itemId }: { orderId: string, itemId: string }) => {
    const [cancelItem, { isLoading }] = useCancelOrderItemsMutation();

    const handleDelete = async () => {
        try {
            await cancelItem({ orderId, itemsId: itemId }).unwrap();
            toast.success("Item deleted successfully");
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the order item from the system and cancel it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null} Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

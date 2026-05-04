"use client";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { OrderStatus } from "@/types/order";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUpdateOrderStatusMutation } from "@/services/orderApi";
import { Spinner } from "@/components/ui/spinner";

export const UpdateStatusAction = ({ orderId, itemId, currentStatus }: { orderId: string, itemId: string, currentStatus: OrderStatus }) => {
    const statuses: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation()
    const handleUpdate = async (status: OrderStatus) => {
        try {
            await updateOrderStatus({ orderId, itemId, status }).unwrap();
            toast.success(`${status} status update successfully`)
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to update status.";
            toast.error(errorMessage);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="h-8 w-8 cursor-pointer">
                    {
                        isLoading ? <Spinner /> : <RefreshCcw size={14} />
                    }

                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {statuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => handleUpdate(status)}
                        className={currentStatus === status ? "bg-muted font-bold" : ""}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

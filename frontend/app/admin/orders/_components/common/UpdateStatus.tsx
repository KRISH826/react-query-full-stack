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

export const UpdateStatusAction = ({ orderId, itemId, currentStatus }: { orderId: string, itemId: string, currentStatus: OrderStatus }) => {
    const statuses: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'];

    const handleUpdate = (status: OrderStatus) => {
        // Here we'd call the mutation, for now mock it:
        toast.info(`Status update API not yet implemented. Targeted status: ${status}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                    <RefreshCcw className="h-4 w-4" />
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

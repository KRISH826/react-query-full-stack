import { useLazyGetOrderJobStatusQuery } from "@/services/orderApi";
import { OrderResponseDTO } from "@/types/order";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useOrderPolling = () => {
    const [jobId, setJobId] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderResponseDTO | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    const [getOrderJobStatus] = useLazyGetOrderJobStatusQuery();

    useEffect(() => {
        if(!jobId) return;
        setIsPolling(true);

        const interval = setInterval(async () => {
            try {
                const res = await getOrderJobStatus(jobId).unwrap();
                if(res.order) {
                    setOrder(res.order);
                    setIsPolling(false);
                    clearInterval(interval);
                } else if(res.state === "failed") {
                    toast.error(res.message || "Order processing failed");
                    setIsPolling(false);
                    clearInterval(interval);
                }
            } catch (error) {
                toast.error("An error occurred while fetching order status");
                setIsPolling(false);
                clearInterval(interval);
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [jobId]);

    return {
        startPolling: (id: string) => setJobId(id),
        order,
        isPolling
    }
}
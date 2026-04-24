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
                    setJobId(null);
                    clearInterval(interval);
                } else if(res.state === "failed") {
                    toast.error(res.reason || res.message || "Order processing failed");
                    setIsPolling(false);
                    setJobId(null);
                    clearInterval(interval);
                }
            } catch (error) {
                toast.error("An error occurred while fetching order status");
                setIsPolling(false);
                setJobId(null);
                clearInterval(interval);
            }
        }, 1000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [getOrderJobStatus, jobId]);

    return {
        startPolling: (id: string) => {
            setOrder(null);
            setJobId(id);
        },
        order,
        isPolling
    }
}

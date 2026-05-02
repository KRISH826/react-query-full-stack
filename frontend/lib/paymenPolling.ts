export const waitForOrderConfirmation = async ({
    orderId,
    onSuccess,
    onFallback,
}: {
    orderId: string;
    onSuccess: () => void;
    onFallback?: () => void;
}) => {
    let delay = 2000; // start 2 sec

    for (let i = 0; i < 5; i++) {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json();

            if (data?.order?.status === "confirmed") {
                onSuccess();
                return;
            }
        } catch (err) {
            console.error("Polling error:", err);
        }

        await new Promise((r) => setTimeout(r, delay));
        delay *= 1.7; // exponential backoff
    }

    // fallback
    onFallback?.();
};
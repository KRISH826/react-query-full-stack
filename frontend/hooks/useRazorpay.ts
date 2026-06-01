import { useCreatePaymentMutation, useVerifyPaymentMutation, useCancelPaymentMutation } from "@/services/orderApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RazorpayInstance {
    on(event: string, handler: () => void): void;
    open(): void;
}

interface RazorpayWindow extends Window {
    Razorpay: new (options: unknown) => RazorpayInstance;
}

export const useRazorpay = () => {
    const [createPayment] = useCreatePaymentMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [cancelPayment] = useCancelPaymentMutation();
    const router = useRouter();

    const loadScript = () =>
        new Promise<boolean>((resolve) => {
            const rzpWindow = window as unknown as RazorpayWindow;
            if (rzpWindow.Razorpay) return resolve(true);

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const initiatePayment = async ({
        orderId,
        amount,
        userName,
        userEmail,
        userPhone,
    }: {
        orderId: string;
        amount: number;
        userName: string;
        userEmail: string;
        userPhone: string;
    }) => {
        const loaded = await loadScript();
        if (!loaded) {
            toast.error("Razorpay SDK failed");
            return;
        }

        const res = await createPayment({
            order_id: orderId,
            amount: amount, // ✅ FIXED
        }).unwrap();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: "INR",
            name: "Your Store",
            description: "Order Payment",
            order_id: res.payment.razorpay_order_id,

            // ✅ FAST PATH
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
                try {
                    await verifyPayment({
                        order_id: orderId,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }).unwrap();

                    router.push(`/order-success/${orderId}`);
                } catch {
                    toast.error("Payment verification failed");
                }
            },

            modal: {
                ondismiss: async () => {
                    toast.error("Payment cancelled");
                    try {
                        await cancelPayment(orderId).unwrap();
                    } catch (err) {
                        console.error("Failed to cancel payment:", err);
                    }
                },
            },

            prefill: {
                name: userName,
                email: userEmail,
                contact: userPhone,
            },

            theme: { color: "#000" },
        };

        const rzpWindow = window as unknown as RazorpayWindow;
        const razor = new rzpWindow.Razorpay(options);

        razor.on("payment.failed", () => {
            toast.error("Payment failed");
        });

        razor.open();
    };

    return { initiatePayment };
};
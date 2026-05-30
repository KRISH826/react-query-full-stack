import { sendEmailService } from "../controllers/email/email.service";
import express, {Request, Response} from "express"
const router = express.Router()

// order.routes.ts - temporarily add karo
router.get("/test-email", async (req: Request, res: Response) => {
    await sendEmailService(
        "order_confirmation", 
        "krishnendupanja98@gmail.com",
        {
            customer_name: "Test User",
            order_number: "ORD-001",
            order_date: new Date().toISOString(),
            total_amount: "999",
            shipping_address: "123 Test St",
            city: "Kolkata",
            postal_code: "700001",
            country: "India",
            state: "West Bengal",
            items: "Test Item"
        }
    );
    res.json({ message: "Email sent!" });
});

export default router;
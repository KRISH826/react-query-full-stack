import Razorpay from "razorpay";
import { config } from "../config/config";

const razorpay = new Razorpay({
    key_id: config.razorpay.key_id as string,
    key_secret: config.razorpay.key_secret as string,
})

export default razorpay;
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./db/db";
import userRouter from "./routes/user.route";
import { errorHandler } from "./middlewares/error.middleware";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.routes";
import orderRouter from "./routes/order.routes";
import { config } from "./config/config";
import { Request, Response } from "express";
import categoryRouter from "./routes/category.route";
import paymentRouter from "./routes/payment.route";
import { testDeepSeek } from "./utils/deepseek";


const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://ecom.krishnendupanja.online"
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(helmet());
app.use(morgan("dev"));

connectDB();
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/payments", paymentRouter);

app.get("/health", (req: Request, res: Response) => {
    res.send("Health is OK!")
});

// ❗ MUST BE LAST
app.use(errorHandler);
app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});

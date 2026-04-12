import express from "express";
import cors from "cors";
import { globalLimiter } from "./middlewares/limiter.middleware";
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
import searchRouter from "./routes/search.routes";
import favouriteRouter from "./routes/favourite.route";
import reviewRouter from "./routes/review.routes";
import helmet from "helmet";
import { startUpCleanScheduler } from "./corn/cleanup.queue";
import "./corn/user/cleanup.worker"
import { startProductScheduler } from "./corn/product/product.scheduler";
import "./corn/product/product.worker"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json(
    {
        limit: "3mb"
    }
));
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
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", globalLimiter);
connectDB();
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/search-products", searchRouter);
app.use("/api/favourites", favouriteRouter)
app.use("/api/reviews", reviewRouter)

app.get("/health", (req: Request, res: Response) => {
    res.send("Health is Perfect!")
});

app.use(errorHandler);
app.listen(config.app.port, async () => {
    await startUpCleanScheduler();
    await startProductScheduler();
    console.log(`Server is running on port ${config.app.port}`);
});

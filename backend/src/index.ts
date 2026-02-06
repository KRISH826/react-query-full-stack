import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./db/db";
import { config } from "../src/config/config";
import userRouter from "../src/routes/user.route";
import { errorHandler } from "./middlewares/error.middleware";
import productRouter from "../src/routes/product.route";
import cartRouter from "../src/routes/cart.routes";
import orderRouter from "../src/routes/order.routes";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
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
// ❗ MUST BE LAST
app.use(errorHandler);
app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});

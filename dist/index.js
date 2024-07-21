import express from "express";
import { connectDB } from "./utils/features.js";
import UserRoutes from "./routes/user.js";
import ProductRoutes from "./routes/products.js";
import OrderRoutes from "./routes/orders.js";
import DiscountRoutes from "./routes/discount.js";
import AdminRoutes from "./routes/stats.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
const app = express();
export const myCache = new NodeCache();
config({
    path: "./config.env",
});
const port = process.env.PORT || 4000;
const stripeKey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripeKey);
// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
connectDB(process.env.MONGO_URI);
// Routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/order", OrderRoutes);
app.use("/api/v1/discount", DiscountRoutes);
app.use("/api/v1/dashboard", AdminRoutes);
// Using express static file Middleware
app.use("/uploads", express.static("uploads"));
// Using custom Error Middleware..
app.use(errorMiddleware);
// Test....
app.get("/", (req, res) => {
    res.send("Hii There Welcome to our Terminal....");
});
// Listening to the server....
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

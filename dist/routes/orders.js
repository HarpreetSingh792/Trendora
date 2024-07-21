import express from "express";
import { allOrders, deleteOrder, getSingleOrder, myOrder, newOrder, proccessOrder, } from "../controllers/order.js";
import { createPaymentIntent } from "../controllers/payment.js";
import { isAdmin } from "../middlewares/auth.js";
const app = express.Router();
// http://localhost:4000/api/v1/order/new
app.post("/new", newOrder);
//http:localhost:4000/api/v1/order/create-payment
app.post("/create-payment", createPaymentIntent);
// http://localhost:4000/api/v1/order/my
app.get("/my", myOrder);
// http://localhost:4000/api/v1/order/all
app.get("/all", isAdmin, allOrders);
app
    .route("/:id")
    .get(getSingleOrder)
    .delete(isAdmin, deleteOrder)
    .put(isAdmin, proccessOrder);
export default app;

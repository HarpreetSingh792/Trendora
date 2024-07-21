import express from "express";
import {
    allCoupon,
    applyDiscount,
    delCoupon,
    newCoupon,
} from "../controllers/discount.js";
import { isAdmin } from "../middlewares/auth.js";
const app = express.Router();

//localhost:4000/api/v1/discount/new/
app.post("/new", isAdmin, newCoupon);

//localhost:4000/api/v1/discount/apply/
app.get("/apply", applyDiscount);

//localhost:4000/api/v1/discount/all-coupon/
app.get("/all-coupon", isAdmin, allCoupon);

//localhost:4000/api/v1/discount/:id/
app.delete("/coupon/:id",isAdmin ,delCoupon);

export default app;

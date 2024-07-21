import { stripe } from "../index.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/uitlity-class.js";
export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new ErrorHandler("Please enter the amount", 400));
    const paymentIntent = await stripe.paymentIntents.create({
        currency: "inr",
        amount: Number(amount) * 100,
    });
    res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret
    });
});

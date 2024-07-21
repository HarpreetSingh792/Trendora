import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/discount..js";
import ErrorHandler from "../utils/uitlity-class.js";

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(
      new ErrorHandler("Please enter both amount and coupon code ", 400)
    );
  await Coupon.create({ code: coupon, amount });
  res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Succesfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) {
    res.status(200).json({
      success: false,
      amount: 0,
    });
  } else {
    res.status(200).json({
      success: true,
      amount: discount.amount,
    });
  }
});

export const allCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    success: true,
    coupons,
  });
});

export const delCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));
  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} deleted successfully`,
  });
});

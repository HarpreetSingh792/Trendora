import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { newOrderReq } from "../types/orders.js";
import ErrorHandler from "../utils/uitlity-class.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStocks } from "../utils/features.js";
import { myCache } from "../index.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, newOrderReq>, res, next) => {
    const {
      discount,
      orderItems,
      shippingInfo,
      shippingCharges,
      tax,
      user,
      subtotal,
      total,
    } = req.body;
    if (!user || !total || !orderItems || !shippingInfo || !tax || !subtotal)
      return next(new ErrorHandler("Please Enter All Fields", 400));
    const order = await Order.create({
      discount,
      orderItems,
      shippingInfo,
      shippingCharges,
      tax,
      user,
      subTotal: subtotal,
      total,
    });
    await reduceStocks(orderItems);
    invalidateCache({ product: true, order: true, admin: true,orderId:String(order._id), userId:order.user});
    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);

export const myOrder = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-order-${user}`;
  let orders;
  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }
  res.status(200).json({
    success: true,
    orders,
  });
});
export const allOrders = TryCatch(async (req, res, next) => {
  const key = "all-order";
  let orders;
  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find({}).populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;
  let order;
  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order not Found", 404));
    myCache.set(key, JSON.stringify(order));
  }
  return res.status(200).json({
    success: true,
    order,
  });
});

export const proccessOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if(!order) return next(new ErrorHandler("Order not found",404));
  
  switch(order.status){
    case "Processing":
      order.status ="Shipped";
      break;
    case "Shipped":
      order.status ="Delivered";
      break;
    default:
      order.status="Delivered";
      break;
  }
  await order.save();
  invalidateCache({product:true,order:true,admin:true,orderId:id,userId:order.user})
  return res.status(200).json({
    success:true,
    message:"Order Processed Successfully"
  })
})

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let order = await Order.findByIdAndDelete(id);
  if (!order) return next(new ErrorHandler("Order not Found", 404));
  invalidateCache({product:true,order:true,admin:true,userId:order.user,orderId:String(order._id)});
  res.status(200).json({
    success: true,
    messsages: "Order Deleted Successfully!",
  });
})

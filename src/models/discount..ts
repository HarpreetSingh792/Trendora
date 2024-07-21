import mongoose from "mongoose";

const schema = new mongoose.Schema({
    code:{
        type:String,
        unique:true,
        required:[true,"Please Enter the Coupon Code"]
    },
    amount:{
        type:Number,
        required:[true,"Please Enter the Amount"]
    }
})

export const Coupon = mongoose.model("Coupons",schema);
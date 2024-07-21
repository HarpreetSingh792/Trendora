import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Product Name"],
    },
    description:{
      type:String,
      required:[true,"Please enter Product Description"]
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Product Price"],
    },
    category: {
      type: String,
      required: [true, "Please add Category"],
      trim:true
    },
    stocks: {
      type: Number,
      required: [true, "Please Enter the number of Stocks"],
    },
  },
  {
    timestamps: true,
  }
);

export const ProductSchema = mongoose.model("Products", Schema);

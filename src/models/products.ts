import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Product Name"],
    },
    description: {
      type: String,
      required: [true, "Please enter Product Description"],
    },
    photos: [
      {
        public_id: {
          type: String,
          required: [true, "Please enter Public ID"],
        },
        url: {
          type: String,
          required: [true, "Please enter URL"],
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Please enter Product Price"],
    },
    category: {
      type: String,
      required: [true, "Please add Category"],
      trim: true,
    },
    stocks: {
      type: Number,
      required: [true, "Please Enter the number of Stocks"],
    },
    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductSchema = mongoose.model("Product", Schema);

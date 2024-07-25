import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    comments: {
        type: String,
        maxLength: [200, "Comment must not be more than 200 charcaters"],
    },
    ratings: {
        type: Number,
        min: [1, "Rating must be atleast 1"],
        max: [5, "Rating must not be more than 5"],
        requried: [true, "Please give Rating"]
    },
    user: {
        type: String,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, {
    timestamps: true
});
export const Review = mongoose.model("Review", reviewSchema);

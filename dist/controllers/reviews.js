import { TryCatch } from "../middlewares/error.js";
import { ProductSchema } from "../models/products.js";
import { Review } from "../models/reviews.js";
import { UserSchema } from "../models/user.js";
import { findAverageRatings } from "../utils/features.js";
import ErrorHandler from "../utils/uitlity-class.js";
export const allReviewsOfProduct = TryCatch(async (req, res) => {
    const { id } = req.params;
    const review = await Review.find({ product: id }).populate('user', "name photo")
        .sort({ updatedAt: -1 });
    res.status(200).json({
        success: true,
        review,
    });
});
export const newReview = TryCatch(async (req, res, next) => {
    const user = await UserSchema.findById(req.query.id);
    if (!user)
        return next(new ErrorHandler("Please Login First", 404));
    const product = await ProductSchema.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    const alreadyReviewed = await Review.findOne({
        user: user._id,
        product: product._id,
    });
    console.log(alreadyReviewed);
    const { comments, ratings } = req.body;
    if (alreadyReviewed) {
        alreadyReviewed.comments = comments;
        alreadyReviewed.ratings = ratings;
        await alreadyReviewed.save();
    }
    else {
        await Review.create({
            comments,
            ratings,
            user: user._id,
            product: product._id,
        });
    }
    const { numOfReviews, ratings: avgRatings } = await findAverageRatings(product._id);
    product.numOfReviews = numOfReviews;
    product.ratings = avgRatings;
    await product.save();
    res.status(alreadyReviewed ? 200 : 201).json({
        success: true,
        message: alreadyReviewed ? "Review Updated" : "Review Added",
    });
});
export const deleteReview = TryCatch(async (req, res, next) => {
    const user = UserSchema.findById(req.query.id);
    if (!user)
        return next(new ErrorHandler("Please Login First", 401));
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review)
        return next(new ErrorHandler("Review is already deleted or not Exists", 404));
    const product = await ProductSchema.findById(review.product);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    const { ratings, numOfReviews } = await findAverageRatings(product._id);
    product.ratings = ratings;
    product.numOfReviews = numOfReviews;
    await product.save();
    await review.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Review Deleted",
    });
});

import express from "express";
import { NewProd, deleteProdById, getAllProducts, getSingleProduct, latestProducts, prodCategory, searchProduct, updateProdById } from "../controllers/products.js";
import { allReviewsOfProduct, deleteReview, newReview } from "../controllers/reviews.js";
import { isAdmin } from "../middlewares/auth.js";
import { multiUploads } from "../middlewares/multer.js";
const app = express.Router();
//  http://localhost:4000/api/v1/product/new
app.post("/new", isAdmin, multiUploads, NewProd);
// http://localhost:4000/api/v1/product/filter
app.get("/filter", searchProduct);
// http://localhost:4000/api/v1/product/latest
app.get("/latest", latestProducts);
// http://localhost:4000/api/v1/product/category
app.get("/category", prodCategory);
// http://localhost:4000/api/v1/product/admin-products/all
app.get("/all", getAllProducts);
// Dynamic Routes
// http://localhost:4000/api/v1/product/:id
app.route("/:id").get(getSingleProduct).delete(isAdmin, deleteProdById).put(isAdmin, multiUploads, updateProdById);
// Review Routes
app.get("/reviews/:id", allReviewsOfProduct);
app.post("/review/new/:id", newReview);
app.delete("/review/:id", deleteReview);
export default app;

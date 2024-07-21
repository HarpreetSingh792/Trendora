import express from "express";
import { NewProd, deleteProdById, getAllProducts, getSingleProduct, latestProducts, prodCategory, searchProduct, updateProdById } from "../controllers/products.js";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
//  http://localhost:4000/api/v1/product/new
app.post("/new", isAdmin, singleUpload, NewProd);
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
app.route("/:id").get(getSingleProduct).delete(isAdmin, deleteProdById).put(isAdmin, singleUpload, updateProdById);
export default app;

import express from "express";
import { delUserById, getAllUsers, getUserById, newUser } from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();

// http://localhost:4000/api/v1/user/new
app.post("/new",newUser);


// http://localhost:4000/api/v1/user/all
app.get("/all",isAdmin,getAllUsers);


// Dynamic Routes....

// http://localhost:4000/api/v1/user/:id
app.route("/:id").get(getUserById).delete(isAdmin,delUserById)


export default app;
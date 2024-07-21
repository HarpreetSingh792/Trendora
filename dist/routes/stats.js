import express from "express";
import { getBarChart, getDashboardStats, getLineChart, getPieChart, } from "../controllers/stats.js";
import { isAdmin } from "../middlewares/auth.js";
const app = express.Router();
app.get("/home-stats", isAdmin, getDashboardStats);
app.get("/home-pie", isAdmin, getPieChart);
app.get("/home-bar", isAdmin, getBarChart);
app.get("/home-line", isAdmin, getLineChart);
export default app;

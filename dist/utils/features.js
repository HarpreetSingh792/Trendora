import mongoose from "mongoose";
import { myCache } from "../index.js";
import { ProductSchema } from "../models/products.js";
export const connectDB = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "E-commerce24",
    })
        .then((c) => console.log(`Connnected to DB ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = ({ product, order, admin, orderId, productId, userId, }) => {
    if (product) {
        // for deleting the already knonwn keys from cache...
        const cacheKey = ["latest", "all-products", "category"];
        // for all product-id's...
        if (typeof productId === "string")
            cacheKey.push(`product-${productId}`);
        // pushing the id's into cacheKey...
        if (typeof productId === "object")
            productId.forEach((i) => cacheKey.push(`product-${i}`));
        // deleting all the keys from cache...
        myCache.del(cacheKey);
    }
    if (order) {
        const orderKey = [
            `my-order-${userId}`,
            "all-order",
            `order-${orderId}`,
        ];
        myCache.del(orderKey);
    }
    if (admin) {
        const adminKey = [
            "admin-dashboard-stats",
            "admin-bar-chart",
            "admin-pie-charts",
            "admin-line-charts",
        ];
        myCache.del(adminKey);
    }
};
export const reduceStocks = async (orderItems) => {
    orderItems.forEach(async (i) => {
        const product = await ProductSchema.findById(i._id);
        if (!product) {
            return new Error("Product not found");
        }
        product.stocks -= Number(i.quantity);
        await product.save();
    });
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth;
    const percentage = Number(((lastMonth / thisMonth) * 100).toFixed(0));
    return percentage;
};
export const getInventory = async ({ category, productCount, }) => {
    const categoriesCountPromise = category.map((category) => ProductSchema.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    category.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};

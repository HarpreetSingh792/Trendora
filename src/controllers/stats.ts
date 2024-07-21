import { myCache } from "../index.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { ProductSchema } from "../models/products.js";
import { UserSchema } from "../models/user.js";
import {
  calculatePercentage,
  getChartData,
  getInventory,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  const key = "admin-dashboard-stats";
  let stats = {};
  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
  else {
    // today
    const today = new Date();

    // Six Months Stats
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    // This month
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    // LastMonth
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() -1, 1),
      end: new Date(today.getFullYear(), today.getMonth() , 0),
    };

    const thisMonthProdPromise = ProductSchema.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProPromise = ProductSchema.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUserPromise = UserSchema.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUserPromise = UserSchema.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransactionPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status","total"])
      .limit(5);

    const [
      prodThisMonth,
      prodLastMonth,
      userThisMonth,
      userLastMonth,
      orderThisMonth,
      orderLastMonth,
      lastSixMonthOrders,
      latestTransaction,
      productCount,
      userCount,
      allOrders,
      category,
      femaleUserCount,
    ] = await Promise.all([
      thisMonthProdPromise,
      lastMonthProPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthOrderPromise,
      lastSixMonthOrderPromise,
      latestTransactionPromise,
      ProductSchema.countDocuments(),
      UserSchema.countDocuments(),
      Order.find({}).select("total"),
      ProductSchema.distinct("category"),
      UserSchema.countDocuments({ gender: "female" }),
    ]);

    const revenueThisMonth = orderThisMonth.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const revenueLastMonth = orderLastMonth.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(revenueThisMonth, revenueLastMonth),
      user: calculatePercentage(userThisMonth.length, userLastMonth.length),
      product: calculatePercentage(prodThisMonth.length, prodLastMonth.length),
      order: calculatePercentage(orderThisMonth.length, orderLastMonth.length),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      product: productCount,
      userCount: userCount,
      order: allOrders.length,
    };

    const orderMonthCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);
    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
      if (monthDiff < 6) {
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const categoryCount = await getInventory({ category, productCount });

    const userRatio = {
      male: userCount - femaleUserCount,
      female: femaleUserCount,
    };

    const modifiedLatestTransaction = latestTransaction.map((ele) => ({
      _id: ele._id,
      discount: ele.discount,
      quantity: ele.orderItems.length,
      status: ele.status,
      amount:ele.total
    }));

    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCount,
        revenue: orderMonthlyRevenue,
      },
      userRatio,
      latestTransaction: modifiedLatestTransaction,
    };

    // Caching the data
    myCache.set(key, JSON.stringify(stats));
  }

  res.status(200).json({
    success: true,
    stats,
  });
});

export const getBarChart = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-chart";
  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sixMonthProductPromise = ProductSchema.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = UserSchema.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const SixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      SixMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 6, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts: charts,
  });
});

export const getPieChart = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      category,
      productCount,
      outOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      ProductSchema.distinct("category"),
      ProductSchema.countDocuments(),
      ProductSchema.countDocuments({ stock: 0 }),
      allOrderPromise,
      UserSchema.find({}).select(["dob"]),
      UserSchema.countDocuments({ role: "admin" }),
      UserSchema.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const productCategories = await getInventory({
      category,
      productCount,
    });

    const stockAvailablity = {
      inStock: productCount - outOfStock,
      outOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailablity,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineChart = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const baseQuery = {
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      ProductSchema.find(baseQuery).select("createdAt"),
      UserSchema.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const discount = getChartData({
      length: 6,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 6,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

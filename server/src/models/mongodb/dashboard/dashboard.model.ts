import { model, Schema } from "mongoose";
import { DashboardDtoType } from "../../../dto/dashboard/dashboard.dto";

// User
const generalStatisticsSchema = {
  totalAdmins: { type: Number, required: true, default: 0 },
  totalUsers: { type: Number, required: true, default: 0 },
  totalMen: { type: Number, required: true, default: 0 },
  totalWomen: { type: Number, required: true, default: 0 },
  totalPersonalAccounts: { type: Number, required: true, default: 0 },
  totalBusinessAccounts: { type: Number, required: true, default: 0 },
  newUsersToday: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  inactiveUsers: { type: Number, default: 0 },
  totalVisitors: { type: Number, default: 0 },
  totalLoginInDay: { type: Number, default: 0 },
};

// Financial & Analytical Data
const financialDataSchema = {
  totalRevenue: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
};

// Category and subCategory and brand
const categorySchema = {
  totalCategories: { type: Number, required: true, default: 0 },
  totalSubcategories: { type: Number, required: true, default: 0 },
  totalBrands: { type: Number, required: true, default: 0 },
  totalTypes: { type: Number, required: true, default: 0 },
  mostVisitedCategory: { type: String, default: "" },
  totalVisitedCategory: { type: Number, required: true, default: 0 },
};

// Reports
const reportSchema = {
  totalReports: { type: Number, required: true, default: 0 },
  newReportsToday: { type: Number, required: true, default: 0 },
  pending: { type: Number, default: 0 },
  reviewed: { type: Number, default: 0 },
  resolved: { type: Number, default: 0 },
  totalReportConversations: { type: Number, default: 0 },
  totalReportItems: { type: Number, default: 0 },
  totalDeleteReports: { type: Number, default: 0 },
};

// Items
const itemSchema = {
  totalItems: { type: Number, required: true, default: 0 },
  totalDeleteItems: { type: Number, required: true, default: 0 },
  newItemsToday: { type: Number, required: true, default: 0 },
  underReview: { type: Number, default: 0 },
  approved: { type: Number, default: 0 },
  published: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  reject: { type: Number, default: 0 },
};

// Orders & Inventory
const ordersInventorySchema = {
  totalOrders: { type: Number, required: true, default: 0 },
  newOrdersToday: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
  delivered: { type: Number, default: 0 },
  canceled: { type: Number, default: 0 },
  refund: { type: Number, default: 0 },
  processing: { type: Number, default: 0 },
  shipped: { type: Number, default: 0 },
  totalDeleteOrders: { type: Number, default: 0 },
};

// Sellers & Buyers Activity
const sellersBuyersActivitySchema = {
  totalSellers: { type: Number, default: 0 },
  newSellersThisMonth: { type: Number, default: 0 },
  topSellingSellers: { type: [String], default: [] },
  bestSellingProduct: { type: String, default: "" },
};

// Reviews & Ratings
const reviews = {
  totalReviews: { type: Number, required: true, default: 0 },
  positiveReviews: { type: Number, default: 0 },
  negativeReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalBad: { type: Number, default: 0 },
  totalAverage: { type: Number, default: 0 },
  totalGood: { type: Number, default: 0 },
  totalVeryGood: { type: Number, default: 0 },
  totalExcellent: { type: Number, default: 0 },
  newReviewsToday: { type: Number, default: 0 },
};

// Security & Performance
const securityPerformanceSchema = {
  totalRegisterWithPhone: { type: Number, default: 0 },
  totalRegisterWithEmail: { type: Number, default: 0 },
  totalSuccessLogins: { type: Number, default: 0 },
  totalFailedLogins: { type: Number, default: 0 },
  total2FASuccess: { type: Number, default: 0 },
  total2FAFailed: { type: Number, default: 0 },
  totalUpdatePassword: { type: Number, default: 0 },
  totalResetPassword: { type: Number, default: 0 },
  totalDeletedAccounts: { type: Number, default: 0 },
  totalBlockedAccounts: { type: Number, default: 0 },
  totalUnauthorizedAPIRequests: { type: Number, default: 0 },
  totalAccessDenied: { type: Number, default: 0 },
};

// Main Dashboard
const dashboardSchema: Schema = new Schema(
  {
    users: generalStatisticsSchema,
    items: itemSchema,
    reports: reportSchema,
    financial: financialDataSchema,
    categories: categorySchema,
    orders: ordersInventorySchema,
    reviews: reviews,
    sellersBuyersActivity: sellersBuyersActivitySchema,
    security: securityPerformanceSchema,
  },
  { timestamps: true }
);

const backupDashboard: Schema = new Schema(
  {
    users: generalStatisticsSchema,
    items: itemSchema,
    reports: reportSchema,
    financial: financialDataSchema,
    categories: categorySchema,
    orders: ordersInventorySchema,
    reviews: reviews,
    sellersBuyersActivity: sellersBuyersActivitySchema,
    security: securityPerformanceSchema,
  },
  { timestamps: true }
);

export const Dashboard = model<DashboardDtoType>("dashboard", dashboardSchema);
export const BackupDashboard = model<DashboardDtoType>(
  "backupDashboard",
  backupDashboard
);

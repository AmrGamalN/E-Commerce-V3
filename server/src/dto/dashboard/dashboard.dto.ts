import { z } from "zod";

// User
export const userSchema = z.object({
  totalAdmins: z.number().default(0),
  totalUsers: z.number().default(0),
  totalMen: z.number().default(0),
  totalWomen: z.number().default(0),
  totalPersonalAccounts: z.number().default(0),
  totalBusinessAccounts: z.number().default(0),
  newUsersToday: z.number().default(0),
  activeUsers: z.number().default(0),
  inactiveUsers: z.number().default(0),
  totalVisitors: z.number().default(0),
  totalLoginInDay: z.number().default(0),
});

// Financial & Analytical Data
export const financialSchema = z.object({
  totalRevenue: z.number().default(0),
  monthlyRevenue: z.number().default(0),
  totalProfit: z.number().default(0),
  averageOrderValue: z.number().default(0),
});

// Category
export const categorySchema = z.object({
  totalCategories: z.number().default(0),
  totalSubcategories: z.number().default(0),
  totalBrands: z.number().default(0),
  totalTypes: z.number().default(0),
  mostVisitedCategory: z.string().default(""),
  totalVisitedCategory: z.number().default(0),
});

// Reports
export const reportSchema = z.object({
  totalReports: z.number().default(0),
  newReportsToday: z.number().default(0),
  pending: z.number().default(0),
  reviewed: z.number().default(0),
  resolved: z.number().default(0),
  totalReportConversations: z.number().default(0),
  totalReportItems: z.number().default(0),
  totalDeleteReports: z.number().default(0),
});

// Items
export const itemSchema = z.object({
  totalItems: z.number().default(0),
  totalDeleteItems: z.number().default(0),
  newItemsToday: z.number().default(0),
  underReview: z.number().default(0),
  approved: z.number().default(0),
  published: z.number().default(0),
  sold: z.number().default(0),
  reject: z.number().default(0),
});

// Orders & Inventory
export const ordersSchema = z.object({
  totalOrders: z.number().default(0),
  newOrdersToday: z.number().default(0),
  pending: z.number().default(0),
  processing: z.number().default(0),
  shipped: z.number().default(0),
  delivered: z.number().default(0),
  canceled: z.number().default(0),
  refund: z.number().default(0),
  totalDeleteOrders: z.number().default(0),
});

// Sellers & Buyers Activity
export const sellersBuyersSchema = z.object({
  totalSellers: z.number().default(0),
  newSellersThisMonth: z.number().default(0),
  topSellingSellers: z.array(z.string()).default([]),
  bestSellingProduct: z.string().default(""),
});

// Reviews & Ratings
export const reviewsSchema = z.object({
  totalReviews: z.number().default(0),
  positiveReviews: z.number().default(0),
  negativeReviews: z.number().default(0),
  averageRating: z.number().default(0),
  totalBad: z.number().default(0),
  totalAverage: z.number().default(0),
  totalGood: z.number().default(0),
  totalVeryGood: z.number().default(0),
  totalExcellent: z.number().default(0),
  newReviewsToday: z.number().default(0),
});

// Security & Performance
export const securitySchema = z.object({
  totalRegisterWithPhone: z.number().default(0),
  totalRegisterWithEmail: z.number().default(0),
  totalSuccessLogins: z.number().default(0),
  totalFailedLogins: z.number().default(0),
  total2FASuccess: z.number().default(0),
  total2FAFailed: z.number().default(0),
  totalUpdatePassword: z.number().default(0),
  totalResetPassword: z.number().default(0),
  totalDeletedAccounts: z.number().default(0),
  totalBlockedAccounts: z.number().default(0),
  totalUnauthorizedAPIRequests: z.number().default(0),
  totalAccessDenied: z.number().default(0),
});

// Main Dashboard
export const dashboardSchema = z.object({
  users: userSchema,
  items: itemSchema,
  reports: reportSchema,
  financial: financialSchema,
  categories: categorySchema,
  orders: ordersSchema,
  reviews: reviewsSchema,
  sellersBuyersActivity: sellersBuyersSchema,
  security: securitySchema,
});

// TypeScript Type for Dashboard DTO
export type DashboardDtoType = z.infer<typeof dashboardSchema>;

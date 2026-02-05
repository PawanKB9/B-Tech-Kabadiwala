import { api as AppApi } from './appApi'
import { cartOrdersApi as OrderApi } from './orderApi'
import { userApi as UserApi } from './userApi'

// Logged-in user basic data
export const selectGetUserDataResult =
  UserApi.endpoints.getUserData.select()

// User activity / dashboard stats
export const selectGetUserActivityStatsResult =
  UserApi.endpoints.getUserActivityStats.select()


// App-level data
export const selectGetAppDataResult =
  AppApi.endpoints.getAppData.select()

// Products by center (param: centerId)
export const selectGetProductsByCenterResult = (centerId) =>
  AppApi.endpoints.getProductsByCenter.select(centerId)

// All items
export const selectGetAllItemsResult =
  AppApi.endpoints.getAllItems.select()

// Single item (param: itemId)
export const selectGetItemResult = (itemId) =>
  AppApi.endpoints.getItem.select(itemId)

// Center by ID
export const selectGetCenterByIdResult = (centerId) =>
  AppApi.endpoints.getCenterById.select(centerId)

// Centers by store ID
export const selectGetCentersByStoreIdResult = (storeId) =>
  AppApi.endpoints.getCentersByStoreId.select(storeId)

// All centers (Admin)
export const selectGetAllCentersResult =
  AppApi.endpoints.getAllCenters.select()


// User cart
export const selectGetCartResult =
  OrderApi.endpoints.getCart.select()


// Active orders (Customer)
export const selectGetActiveOrdersResult =
  OrderApi.endpoints.getActiveOrders.select()

// Order history (Customer)
export const selectGetOrderHistoryResult =
  OrderApi.endpoints.getOrderHistory.select()

// Orders for a specific center (param: centerId)
export const selectGetCenterOrdersAdminResult = (centerId) =>
  OrderApi.endpoints.getCenterOrdersAdmin.select(centerId)

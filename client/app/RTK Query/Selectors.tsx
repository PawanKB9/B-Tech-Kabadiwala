import { UserApi } from './UserApi';
import { AdminApi } from './AdminApi';
import { AppApi } from './AppApi';

// user selector
export const selectGetCurUserResult = UserApi.endpoints.getCurrentUser.select();

// Admin Profile
export const selectGetAdminProfileResult = AdminApi.endpoints.getAdminUser.select();

// Material Rates
export const selectGetMaterialRateResult = AppApi.endpoints.getMaterialRate.select();

// My Orders
export const selectGetMyOrderResult = AppApi.endpoints.getMyOrder.select();

// App Data for Admin
export const selectGetAppDataAdminResult = AppApi.endpoints.getAppDataAdmin.select();

// User Orders (area-specific: pass 'area' as param to selector)
export const selectGetUserOrderResult = (area) => AppApi.endpoints.getUserOrder.select(area);

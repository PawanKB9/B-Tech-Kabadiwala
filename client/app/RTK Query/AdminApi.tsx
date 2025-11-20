// src/RTK Query/AdminApi.js
import { AppApi } from "./AppApi";

export const AdminApi = AppApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new admin user
    adminSignUp: builder.mutation({
      query: ({ name, password, passKey, aadharNo, email, phone, token }) => ({
        url: `/admin/signUp`,
        method: "POST",
        body: { name, password, passKey, aadharNo, email, phone, token },
      }),
      invalidatesTags: ["admin"],
    }),

    // Admin Log in
    adminLogIn: builder.mutation({
      query: ({ phone, password }) => ({
        url: `/admin/login`,
        method: "POST",
        body: { phone, password },
      }),
      invalidatesTags: ["admin"],
    }),

    // Admin Log out
    adminLogOut: builder.mutation({
      query: () => ({
        url: `/admin/logout`,
        method: "POST",
      }),
      invalidatesTags: ["admin"],
    }),

    // Get current admin data
    getAdminUser: builder.query({
      query: () => ({
        url: `/admin/details`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),

    // Change admin's Password
    changeAdminPassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: `/admin/changepassword`,
        method: "PATCH",
        body: { oldPassword, newPassword },
      }),
      invalidatesTags: ["admin"],
    }),

    // Reset admin's password
    forgotAdminPassword: builder.mutation({
      query: ({ phone, password, token }) => ({
        url: `/admin/forgotpassword`,
        method: "POST",
        body: { phone, password, token },
      }),
      invalidatesTags: ["admin"],
    }),

    // Update admin's Contact number
    updateAdminContact: builder.mutation({
      query: ({ oldContact, newContact, token }) => ({
        url: `/admin/update-contact`,
        method: "PATCH",
        body: { oldContact, newContact, token },
      }),
      invalidatesTags: ["admin"],
    }),

    // Admin orders booking for user
    adminOrder: builder.mutation({
      query: ({ items, userInfo }) => ({
        url: `/admin/admin-order`,
        method: "POST",
        body: { items, userInfo },
      }),
      invalidatesTags: ["admin"],
    }),

    // Admin edit users order
    adminEditOrder: builder.mutation({
      query: ({ items, orderId, isSold, status }) => ({
        url: `/admin/admin-orderUpdate`,
        method: "PATCH",
        body: { items, orderId, isSold, status },
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useAdminSignUpMutation,
  useAdminLogInMutation,
  useAdminLogOutMutation,
  useGetAdminUserQuery,
  useChangeAdminPasswordMutation,
  useForgotAdminPasswordMutation,
  useUpdateAdminContactMutation,
  useAdminOrderMutation,
  useAdminEditOrderMutation,
} = AdminApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const AppApi = createApi({
  reducerPath: 'AppApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/kabadiwala/api',
    credentials: 'include', // ✅ applied globally
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['price', 'order', 'app-data', 'user-order'], // ✅ central tags
  endpoints: (builder) => ({

    // ✅ Get all materials rate
    getMaterialRate: builder.query({
      query: () => '/order/prices',
      providesTags: ['price'],
    }),

    // ✅ Create new order
    newOrder: builder.mutation({
      query: ({ items, isSold, area }) => ({
        url: '/order/newOrder',
        method: 'POST',
        body: { items, isSold, area },
      }),
      invalidatesTags: ['order'],
    }),

    // ✅ Get all my orders
    getMyOrder: builder.query({
      query: () => '/order/getOrder',
      providesTags: ['order'],
    }),

    // ✅ Edit current order
    editOrder: builder.mutation({
      query: ({ items, orderId, status, isSold, area }) => ({
        url: '/order/editOrder',
        method: 'PATCH',
        body: { items, orderId, isSold, status, area },
      }),
      invalidatesTags: ['order'],
    }),

    // ✅ Update status of order by admin
    statusUpdate: builder.mutation({
      query: ({ orderId, status, area }) => ({
        url: '/order/status-update',
        method: 'PATCH',
        body: { orderId, status, area },
      }),
      invalidatesTags: ['order'],
    }),

    // ✅ Update each material’s price
    materialPriceUpdate: builder.mutation({
      query: ({ area, pricePerKg }) => ({
        url: '/order/price-update',
        method: 'PATCH',
        body: { area, pricePerKg },
      }),
      invalidatesTags: ['price'],
    }),

    // ✅ Update total purchase
    updateTotalPurchase: builder.mutation({
      query: ({ area, totalPurchase }) => ({
        url: '/order/update-totalPurchase',
        method: 'PATCH',
        body: { area, totalPurchase },
      }),
      invalidatesTags: ['app-data'],
    }),

    // ✅ Get total purchase & price per kg (Admin)
    getAppDataAdmin: builder.query({
      query: (area) => ({
        url: '/order/app-data',
        params: { area },
      }),
      providesTags: ['app-data'],
    }),

    // ✅ Create new center
    createCenter: builder.mutation({
      query: ({ area, totalPurchase, pricePerKg }) => ({
        url: '/order/create-appData',
        method: 'POST',
        body: { area, totalPurchase, pricePerKg },
      }),
      invalidatesTags: ['app-data'],
    }),

    // ✅ Get user orders
    getUserOrder: builder.query({
      query: (area) => ({
        url: '/order/get-userOrder',
        params: { area },
      }),
      providesTags: ['user-order'],
    }),

    // ✅ Delete user orders
    deleteUserOrder: builder.mutation({
      query: (orderIds) => ({
        url: '/order/delete-userOrder',
        method: 'DELETE',
        body: { orderIds },
      }),
      invalidatesTags: ['user-order'],
    }),

  }),
});

export const {
  // Lazy Queries
  useLazyGetMaterialRateQuery,
  useLazyGetMyOrderQuery,
  useLazyGetAppDataAdminQuery,
  useLazyGetUserOrderQuery,

  // Normal Queries
  useGetMaterialRateQuery,
  useGetMyOrderQuery,
  useGetAppDataAdminQuery,
  useGetUserOrderQuery,

  // Mutations
  useNewOrderMutation,
  useEditOrderMutation,
  useStatusUpdateMutation,
  useMaterialPriceUpdateMutation,
  useUpdateTotalPurchaseMutation,
  useCreateCenterMutation,
  useDeleteUserOrderMutation,
} = AppApi;

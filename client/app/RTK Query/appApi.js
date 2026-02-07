import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  // refetchOnFocus: true, // need listener in store
  // refetchOnReconnect: true,  // need listener in store
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
    credentials: 'include',

    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Accept', 'application/json')
      return headers
    },
  }),

  tagTypes: ['Products', 'Cart', 'Items', 'App', 'Centers', 'Auth', 'User', 'Activity', 'Orders', 'Invoices', 'Admin', ],

  endpoints: (builder) => ({
    // -------------------- PRODUCTS --------------------
    getProductsByCenter: builder.query({
      query: ({centerId, captchaToken}) => ({
        url: `api/products/${centerId}`,
        method: 'GET',
        credentials: 'include',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ["Products"],
    }),


    // -------------------- ITEMS MASTER --------------------
    getAllItems: builder.query({
      query: ({captchaToken}) => ({
        url: `api/items`,
        method: 'GET',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ['Items'],
    }),

    getItem: builder.query({
      query: ({id, captchaToken}) => ({
        url: `api/items/${id}`,
        method: 'GET',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: (_r, _e, id) => [{ type: 'Items', id }],
    }),

    createItem: builder.mutation({
      query: ({payload, captchaToken}) => ({
        url: `api/items`,
        method: 'POST',
        body: payload,
        headers: captchaToken
          ? {
              "X-Captcha-Token": captchaToken,
            }
          : {},
      }),
      invalidatesTags: ['Items'],
    }),

    // -------------------- APP DATA --------------------
    getAppData: builder.query({
      query: ({ captchaToken }) => ({
        url: "api/app/data",
        method: "GET",
        headers: captchaToken
          ? {
              "X-Captcha-Token": captchaToken,
            }
          : {},
      }),
      providesTags: ["App"],
    }),


    // -------------------- ADMIN CENTER --------------------
    getCenterById: builder.query({
      query: ({id, captchaToken}) => ({
        url: `admin/center/${id}`,
        method: 'GET',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {}
      }),
      providesTags: ['Centers'],
    }),

    getCentersByStoreId: builder.query({
      query: ({storeId,captchaToken}) => ({
        url: `admin/center/store/${storeId}`,
        method: 'GET',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {}
      }),
      providesTags: ['Centers'],
    }),

    getAllCenters: builder.query({
      query: ({captchaToken}) => ({
        url: `admin/center/all`,
        method: 'GET',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {}
      }),
      providesTags: ['Centers'],
    }),

    // -------------------- SECURITY / OTP --------------------
    requestOtp: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: `/auth/otp/request`,
        method: 'POST',
        body: payload,
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {}
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useGetProductsByCenterQuery,
  useLazyGetProductsByCenterQuery,
  useGetAllItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useGetAppDataQuery,
  useGetCenterByIdQuery,
  useLazyGetCenterByIdQuery,
  useGetCentersByStoreIdQuery,
  useGetAllCentersQuery,

  useRequestOtpMutation,
} = api

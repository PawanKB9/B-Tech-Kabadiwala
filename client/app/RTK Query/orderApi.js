import { api } from "./appApi"

export const cartOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // -------------------- CART --------------------
    getCart: builder.query({
      query: ({ captchaToken } = {}) => ({
        url: "api/cart/data",
        method: "GET",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ["Cart"],
    }),

    upsertCart: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: "api/cart/upsert",
        method: "PUT",
        credentials: "include",
        body: payload,
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: ({ captchaToken }) => ({
        url: "api/cart/delete",
        method: "DELETE",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ["Cart"],
    }),

    // -------------------- ORDERS (USER) --------------------
    createOrder: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: "api/orders/create",
        method: "POST",
        credentials: "include",
        body: payload,
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    deleteOrderHistory: builder.mutation({
      query: () => ({
        url: `api/orders/history/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),

    deleteAllOrderHistory: builder.mutation({
      query: () => ({
        url: `api/orders/history/delete-all`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),

    getOrderById: builder.query({
      query: ({ orderId, captchaToken }) => ({
        url: `/api/orders/${orderId}`,
        method: "GET",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
    }),

    getActiveOrders: builder.query({
      query: ({ captchaToken } = {}) => ({
        url: "api/orders/active",
        method: "GET",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ["Orders"],
    }),

    getOrderHistory: builder.query({
      query: ({ captchaToken } = {}) => ({
        url: "api/orders/history",
        method: "GET",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ["Orders"],
    }),

    userUpdateOrderStatus: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: "api/orders/status/user",
        method: "PATCH",
        credentials: "include",
        body: payload,
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ["Orders"],
    }),


    updateOrderItems: builder.mutation({
      query: ({ orderId, payload, captchaToken }) => ({
        url: `api/orders/update-items/user`,
        method: "PUT",
        credentials: "include",
        body: payload,
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ["Orders"],
    }),

    // -------------------- ORDERS (ADMIN) --------------------
    getCenterOrdersAdmin: builder.query({
      query: ({centerId, captchaToken}) => ({
        url: `api/orders/center/${centerId}`,
        method: 'GET',
        credentials: 'include',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ['Orders'],
    }),

    adminUpdateOrderStatus: builder.mutation({
      query: ({payload, captchaToken}) => ({
        url: `api/orders/status/admin`,
        method: 'PUT',
        body: payload,
        credentials: 'include',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ['Orders'],
    }),

    adminDeleteMultipleOrders: builder.mutation({
      query: ({payload, captchaToken}) => ({
        url: `api/orders/select/delete-many`,
        method: 'DELETE',
        body: payload,
        credentials: 'include',
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      invalidatesTags: ['Orders'],
    }),

    //-----------------Invoice------------------
    getInvoiceByOrderId: builder.query({
      query: ({ orderId, captchaToken } = {}) => ({
        url: `api/orders/invoices/order/${orderId}`,
        method: "GET",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : {},
      }),
      providesTags: ["Invoices"],
    }),

    downloadInvoicePDF: builder.mutation({
      query: ({ invoiceId, captchaToken }) => ({
        url: `/api/orders/invoices/${invoiceId}/download`,
        method: "GET",
        credentials: "include",
        headers: captchaToken
          ? { "X-Captcha-Token": captchaToken }
          : undefined,
        responseHandler: (response) => response.blob(),
      }),

      async onQueryStarted(
        { invoiceId },
        { queryFulfilled }
      ) {
        try {
          const { data: blob } = await queryFulfilled;

          // ✅ Handle file here (SIDE EFFECT)
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Invoice-${invoiceId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        } catch {
          // silently fail or toast
        }
      },
    }),


  }),
  overrideExisting: false,
})

export const {
  // Cart
  useGetCartQuery,
  useUpsertCartMutation,
  useClearCartMutation,

  // Orders (User)
  useCreateOrderMutation,
  useDeleteOrderHistoryMutation,
  useDeleteAllOrderHistoryMutation,
  useGetOrderByIdQuery,
  useGetActiveOrdersQuery,
  useGetOrderHistoryQuery,
  useUserUpdateOrderStatusMutation,
  useUpdateOrderItemsMutation,

  // Orders (Admin)
  useGetCenterOrdersAdminQuery,
  useLazyGetCenterOrdersAdminQuery,
  useAdminUpdateOrderStatusMutation,
  useAdminDeleteMultipleOrdersMutation,

  // Invoice
  useGetInvoiceByOrderIdQuery,
  useDownloadInvoicePDFMutation,
  // useLazyDownloadInvoicePDFQuery,

} = cartOrdersApi

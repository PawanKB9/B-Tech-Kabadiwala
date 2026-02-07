import { api } from './appApi'

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // -------- PUBLIC (NO AUTH) --------
    createUser: builder.mutation({
      query: ({ payload, captchaToken, otpToken, otpSessionId }) => ({
        url: '/api/user/create',
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
          ...(otpToken ? { 'X-OTP-Token': otpToken } : {}),
          ...(otpSessionId ? { 'X-OTP-Session-ID': otpSessionId } : {}),
        },
      }),
      // optionally invalidates/provides tags:
      invalidatesTags: ['User', 'Products'],
    }),

    forgotPassword: builder.mutation({
      query: ({ payload, captchaToken, otpToken, otpSessionId }) => ({
        url: 'api/user/forgot-password',
        method: 'PATCH',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
          ...(otpToken ? { 'X-OTP-Token': otpToken } : {}),
          ...(otpSessionId ? { 'X-OTP-Session-ID': otpSessionId } : {}),
        },
      }),
      invalidatesTags: ['User']
    }),

    loginUser: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: '/api/user/login',
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      invalidatesTags: ['Auth', 'User', 'Products'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Store token in localStorage
          if (data?.token) {
            localStorage.setItem('token', data.token)
          }
        } catch (err) {
          // Error handling is done in the component
        }
      },
    }),

    // -------- AUTHENTICATED --------
    logoutUser: builder.mutation({
      query: ({captchaToken}) => ({
        url: 'api/user/logout',
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          // Clear token from localStorage
          localStorage.removeItem('token')
        } catch (err) {
          // Even if logout fails, clear the token
          localStorage.removeItem('token')
        }
      },
    }),

    getUserData: builder.query({
      query: ({captchaToken}) => ({
        url: '/api/user/user-data',
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      providesTags: ['User'],
    }),
    
    getUserActivityStats: builder.query({
      query: ({captchaToken}) => ({
        url: 'api/user/activity/stats',
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      providesTags: ['Activity'],
    }),

    // -------- SENSITIVE --------
    changePassword: builder.mutation({
      query: ({payload,captchaToken}) => ({
        url: 'api/user/change-password',
        method: 'PATCH',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      invalidatesTags: ['User']
    }),

    // -------- AUTH + OTP VERIFIED --------
    updateUserInfo: builder.mutation({
      query: ({payload, captchaToken, otpToken, otpSessionId}) => ({
        url: 'api/user/update-user/info',
        method: 'PUT',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
          ...(otpToken ? { 'X-OTP-Token': otpToken } : {}),
          ...(otpSessionId ? { 'X-OTP-Session-ID': otpSessionId } : {}),
        },
      }),
      invalidatesTags: ['User']
    }),

    //---- Admin Only Access ---------
    createUserByAdmin: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: '/api/user/create/admin/temp-user',
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      invalidatesTags: ['Admin'],
    }),

    getReadAnyUserAdmin: builder.query({
      query: ({captchaToken}) => ({
        url: '/api/user/admin/temp-user/read',
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      providesTags: ['Admin'],
    }),

  }),

  overrideExisting: false
})

export const {
  useCreateUserMutation,
  useForgotPasswordMutation,
  useLoginUserMutation,

  useLogoutUserMutation,
  useGetUserDataQuery,
  useLazyGetUserDataQuery,
  useGetUserActivityStatsQuery,

  useChangePasswordMutation,
  useUpdateUserInfoMutation,

  // Admin Only Access
  useGetReadAnyUserAdminQuery,
  useCreateUserByAdminMutation,

} = userApi

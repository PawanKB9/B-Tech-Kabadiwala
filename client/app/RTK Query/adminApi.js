import { api } from './appApi'

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // -------- PUBLIC (NO AUTH) --------
    createAgent: builder.mutation({
      query: ({ payload, captchaToken }) => ({
        url: '/api/agent/register',
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        },
      }),
      invalidatesTags: ['agent'],
    }),

    // -------- FUTURE (AUTH REQUIRED) --------

    getAgentData: builder.query({
    query: ({ captchaToken, token }) => {
        const headers = {
        'Content-Type': 'application/json',
        ...(captchaToken ? { 'X-Captcha-Token': captchaToken } : {}),
        }

        // Optional token override (same pattern as user)
        if (token) {
        headers['Authorization'] = `Bearer ${token}`
        }

        return {
        url: '/api/agent/profile',
        method: 'GET',
        credentials: 'include',
        headers,
        }
    },
    providesTags: ['Agent'],
    }),

    getAgentById: builder.query({
    query: ({ id, token }) => ({
        url: `/api/agent/${id}`,
        method: 'GET',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    }),
    providesTags: ['Agent'],
    }),

  }),
})

export const {
  useCreateAgentMutation,
  useGetAgentDataQuery,
  useGetAgentByIdQuery,
} = adminApi
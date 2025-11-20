import { AppApi } from "./AppApi.jsx";

export const UserApi = AppApi.injectEndpoints({
  reducerPath: 'AppApi',
  endpoints: (builder) => ({
    // Create a new user
    signUp: builder.mutation({
      query: ({ name,  password ,location ,phone, token }) => ({
        url: `/user/signUp`,
        method: 'POST',
        body: { name,  password ,location ,phone, token },
        credentials: "include",
      }),
      invalidatesTags:["user"],
    }),

    // Log in
    logIn: builder.mutation({
      query: ({ phone, password }) => ({
        url: `/user/login`,
        method: 'POST',
        body: { phone, password },
        credentials: "include",
      }),
      invalidatesTags:["user"],
    }),

    // Log out
    logOut: builder.mutation({
      query: () => ({
        url: `/user/logout`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags:["user"],
    }),

    // Get current user data
    getCurrentUser: builder.query({
      query: () => ({
        url: `/user/profile`,
        method:'GET',
        credentials: 'include',
      }),
      providesTags:["user"],
    }),

    // Update name & description
    updateProfile: builder.mutation({
      query: ({name, location , shopName}) => ({
        url: `/user/update-profile`,
        method: 'PATCH',
        body: { name, location , shopName },
        credentials: 'include',
      }),
      invalidatesTags:["user"],
    }),
    
    // change Password
    changePassword: builder.mutation({
      query: ( { oldPassword ,newPassword} ) => ({
        url: `/user/changepassword`,
        method: 'PATCH',
        body: { oldPassword ,newPassword},
        credentials: 'include',
      }),
      invalidatesTags:["user"],
    }),
    
    // Reset password
    forgotPassword: builder.mutation({
      query: ({ phone, password, token }) => ({
        url: `/user/forgotpassword`,
        method: 'POST',
        body: { phone, password, token },
        credentials: "include",
      }),
      invalidatesTags:["user"],
    }),
    
    //update Contact number
    updateContact: builder.mutation({
        query: ({ oldContact, newContact , token}) => ({
            url: `/user/update-contact`,
            method: "PATCH",
            body: { oldContact, newContact , token },
            credentials: 'include',
        }),
        invalidatesTags:["user"],
    }),
    
  }),
});

export const {
  useSignUpMutation,
  useLogInMutation,
  useLogOutMutation,
  useLazyGetCurrentUserQuery,
  useGetCurrentUserQuery,
  useUpdateProfileMutation, 
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useUpdateContactMutation,
} = UserApi;
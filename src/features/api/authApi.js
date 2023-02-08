import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.MODE === "development"
        ? import.meta.env.VITE_BACKEND_DEV_URL
        : import.meta.env.VITE_BACKEND_PROD_URL,
    credentials: "include",
  }),
  tagTypes: ["signup", "login"],
  endpoints: (builder) => ({
    userSignup: builder.mutation({
      query: (body) => ({
        url: "api/auth/signup",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      providesTags: ["signup"],
    }),
    userLogin: builder.mutation({
      query: (body) => ({
        url: "api/auth/login",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      providesTags: ["login"],
    }),
    userLogout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }),
      transformResponse: (response) => {
        localStorage.removeItem("accessToken");
        return response;
      },
    }),
  }),
});

export default authApi;
export const {
  useUserLoginMutation,
  useUserSignupMutation,
  useUserLogoutMutation,
} = authApi;

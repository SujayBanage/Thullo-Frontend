import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./boardApi.js";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: "/api/user/getInfo",
      }),
      providesTags: ["userInfo"],
    }),
    getUsers: builder.query({
      query: (username) => ({
        url: `/api/user/users?username=${username}`,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useLazyGetUsersQuery } = userApi;

export const userApiReducerPath = userApi.reducerPath;

export const selectGetUserInfoResults = userApi.endpoints.getUserInfo.select();

export default userApi;

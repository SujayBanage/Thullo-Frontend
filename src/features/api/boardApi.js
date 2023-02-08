import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import jwt_decode from "jwt-decode";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_DEV_URL
    : import.meta.env.VITE_BACKEND_PROD_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken !== undefined && accessToken !== null) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
  },
});
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("args are : ", args);
  console.log("api is : ", api);
  console.log("extra options", extraOptions);
  const accessToken = localStorage.getItem("accessToken");
  const decoded_token = accessToken ? jwt_decode(accessToken) : null;
  const date = new Date();
  if (decoded_token && decoded_token.exp * 1000 < date.getTime()) {
    const refreshResult = await baseQuery(
      {
        url: "/api/auth/refresh",
        method: "GET",
      },
      args,
      extraOptions
    );
    console.log(refreshResult);
    console.log("result from refresh query : ", refreshResult);
    if (refreshResult?.data) {
      const accessToken = refreshResult?.data?.accessToken;
      localStorage.setItem("accessToken", accessToken);
    }
  }
  const result = await baseQuery(args, api, extraOptions);
  console.log("result from again base query : ", result);
  return result;
};

const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["createBoard", "getAllBoards", "getBoardInfo", "getAllInvites"],
  endpoints: (builder) => ({
    createBoard: builder.mutation({
      query: (body) => ({
        url: "/api/board/create",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }),
      providesTags: ["createBoard"],
      invalidatesTags: ["getAllBoards"],
    }),
    getBoardInfo: builder.query({
      query: (board_id) => ({
        url: `/api/board/getBoardInfo/${board_id}`,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }),
      providesTags: ["getBoardInfo"],
    }),
    getAllBoards: builder.query({
      query: () => ({
        url: "/api/board/getAllBoards",
      }),
      providesTags: ["getAllBoards"],
    }),
    changeBoardVisibility: builder.mutation({
      query: (body) => ({
        url: "/api/board/visibility",
        method: "PATCH",
        body,
      }),
      providesTags: ["visibilityChange"],
      invalidatesTags: ["getBoardInfo"],
    }),
    inviteUser: builder.mutation({
      query: (body) => ({
        url: "/api/board/invites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getBoardInfo"],
    }),
    getAllInvites: builder.query({
      query: () => ({
        url: "/api/board/invites",
        method: "GET",
      }),
      providesTags: ["getAllInvites"],
    }),
    deleteInvite: builder.mutation({
      query: (body) => ({
        url: "/api/board/invites",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getAllInvites"],
    }),
    joinBoard: builder.mutation({
      query: (body) => ({
        url: "/api/board/boardMembers",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getAllInvites", "getAllBoards"],
    }),
    removeUserFromBoard: builder.mutation({
      query: (body) => ({
        url: "/api/board/boardMembers",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getBoardInfo"],
    }),
    updateDescription: builder.mutation({
      query: (body) => ({
        url: "/api/board/description",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getBoardInfo"],
    }),
    deleteBoard: builder.mutation({
      query: (body) => ({
        url: "/api/board/remove",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getAllBoards"],
    }),
    createColumn: builder.mutation({
      query: (body) => ({
        url: "/api/column",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getBoardInfo"],
    }),
    updateColumn: builder.mutation({
      query: (body) => ({
        url: "/api/column",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getBoardInfo"],
    }),
    deleteColumn: builder.mutation({
      query: (body) => ({
        url: "/api/column",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getBoardInfo"],
    }),
    getBoardUsersById: builder.query({
      query: (board_id) => ({
        url: `/api/board/users/${board_id}`,
        method: "GET",
      }),
    }),
    updateBoardName: builder.mutation({
      query: (body) => ({
        url: "/api/board/name",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getAllBoards"],
    }),
  }),
});

export const {
  useCreateBoardMutation,
  useGetBoardInfoQuery,
  useGetAllBoardsQuery,
  useChangeBoardVisibilityMutation,
  useDeleteBoardMutation,
  useGetAllInvitesQuery,
  useInviteUserMutation,
  useJoinBoardMutation,
  useRemoveUserFromBoardMutation,
  useUpdateDescriptionMutation,
  useDeleteInviteMutation,
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useUpdateColumnMutation,
  useGetBoardUsersByIdQuery,
  useUpdateBoardNameMutation,
} = boardApi;

export default boardApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./boardApi.js";
const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["getTasksByColumnId", "getTaskById"],
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (body) => ({
        url: "/api/task/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTasksByColumnId"],
    }),
    shiftTask: builder.mutation({
      query: (body) => ({
        url: "/api/task",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getTasksByColumnId"],
    }),
    deleteTask: builder.mutation({
      query: (body) => ({
        url: "/api/task",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getTasksByColumnId"],
    }),
    uploadAttachment: builder.mutation({
      query: (body) => ({
        url: "/api/task/attachment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    deleteAttachment: builder.mutation({
      query: (body) => ({
        url: "/api/task/attachment",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    addComment: builder.mutation({
      query: (body) => ({
        url: "/api/task/comment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    deleteComment: builder.mutation({
      query: (body) => ({
        url: "/api/task/comment",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    updateDescription: builder.mutation({
      query: (body) => ({
        url: "/api/task/description",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    addLabel: builder.mutation({
      query: (body) => ({
        url: "/api/task/label",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: "/api/task/user",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    updateImage: builder.mutation({
      query: (body) => ({
        url: "/api/task/image",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
    getTaskById: builder.query({
      query: (task_id) => ({
        url: `/api/task/${task_id}`,
        method: "GET",
      }),
      providesTags: ["getTaskById"],
    }),
    getAttachmentById: builder.query({
      query: (attachment_id) => ({
        url: `/api/task/attachment/${attachment_id}`,
        method: "GET",
      }),
    }),
    getCommentById: builder.query({
      query: (comment_id) => ({
        url: `/api/task/comment/${comment_id}`,
        method: "GET",
      }),
    }),
    getTasksByColumnId: builder.query({
      query: (column_id) => ({
        url: `/api/task/column/${column_id}`,
        method: "GET",
      }),
      providesTags: ["getTasksByColumnId"],
    }),
    updateTaskName: builder.mutation({
      query: (body) => ({
        url: "/api/task/name",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getTaskById"],
    }),
  }),
});

export default taskApi;
export const {
  useCreateTaskMutation,
  useAddCommentMutation,
  useAddLabelMutation,
  useAddUserMutation,
  useDeleteAttachmentMutation,
  useDeleteCommentMutation,
  useDeleteTaskMutation,
  useGetAttachmentByIdQuery,
  useGetCommentByIdQuery,
  useGetTaskByIdQuery,
  useShiftTaskMutation,
  useUpdateDescriptionMutation,
  useUpdateImageMutation,
  useUploadAttachmentMutation,
  useGetTasksByColumnIdQuery,
  useUpdateTaskNameMutation,
} = taskApi;

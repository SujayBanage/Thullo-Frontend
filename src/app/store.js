import { configureStore } from "@reduxjs/toolkit";
import authApi from "../features/api/authApi.js";
import boardApi from "../features/api/boardApi.js";
import userApi from "../features/api/userApi.js";
import taskApi from "../features/api/taskApi.js";
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      boardApi.middleware,
      userApi.middleware,
      taskApi.middleware,
    ]),
  devTools: import.meta.env.MODE === "development" ? true : false,
});

export default store;

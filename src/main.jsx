import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.css";
import App from "./App";
// import AllBoards from "./components/AllBoards/AllBoards";
// import Authentication from "./components/Authentication/Authentication";
// import Board from "./components/Board/Board";
// const App = lazy(() => import("./App.jsx"));
const Authentication = lazy(() =>
  import("./components/Authentication/Authentication.jsx")
);
const AllBoards = lazy(() => import("./components/AllBoards/AllBoards.jsx"));
const Board = lazy(() => import("./components/Board/Board.jsx"));
import ScreenLoader from "./components/ScreenLoader/ScreenLoader";

import { Provider } from "react-redux";
import store from "./app/store.js";
import PrivateRoute from "./PrivateRoute/PrivateRoute.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute type="auth">
        <Suspense fallback={<ScreenLoader />}>
          <Authentication />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <PrivateRoute type="private">
        {/* <Suspense fallback={<ScreenLoader />}> */}
        <App />
        {/* </Suspense> */}
      </PrivateRoute>
    ),
    children: [
      {
        path: "/app/",
        element: (
          <PrivateRoute type="private">
            <Suspense fallback={<ScreenLoader />}>
              <AllBoards />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/app/board/:board_id",
        element: (
          <PrivateRoute type="private">
            <Suspense fallback={<ScreenLoader />}>
              <Board />
            </Suspense>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);

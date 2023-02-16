import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import store from "./app/store.js";
import userApi from "./features/api/userApi.js";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import SocketContext from "./context/socketContext";

const App = () => {
  useEffect(() => {
    store.dispatch(userApi.endpoints.getUserInfo.initiate());
  }, []);
  return (
    <div className="app_container">
      <Navbar />
      <SocketContext>
        <Outlet />
      </SocketContext>
      <ToastContainer />
    </div>
  );
};

export default App;

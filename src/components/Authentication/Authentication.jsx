import { useState, lazy, Suspense } from "react";
import "./Authentication.css";
// import Login from "../Login/Login";
// import Signup from "../Signup/Signup";
const Login = lazy(() => import("../Login/Login.jsx"));
const Signup = lazy(() => import("../Signup/Signup.jsx"));
import logo from "../../assets/images/Logo.svg";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import SkeletonAuth from "../skeletonComponents/SkeletonAuth";

const Authentication = () => {
  const [activeAuth, setActiveAuth] = useState("login");
  return (
    <div className="authentication_page">
      <img src={logo} />
      <div className="authentication_component">
        <div className="authentication_selection_buttons">
          <button
            className={activeAuth === "login" ? "login_active" : "select_login"}
            onClick={() => setActiveAuth("login")}
          >
            Login
          </button>
          <button
            className={
              activeAuth === "signup" ? "signup_active" : "select_login"
            }
            onClick={() => setActiveAuth("signup")}
          >
            Signup
          </button>
        </div>
        {activeAuth === "login" ? (
          <Suspense fallback={<SkeletonAuth type="login" />}>
            <Login />
          </Suspense>
        ) : (
          <Suspense fallback={<SkeletonAuth type="signup" />}>
            <Signup />
          </Suspense>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Authentication;

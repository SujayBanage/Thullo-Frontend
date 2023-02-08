import "./Login.css";
import { useState } from "react";
import InputError from "../InputError/InputError.jsx";
import { useUserLoginMutation } from "../../features/api/authApi.js";
import { emailRegex, passwordRegex } from "../../constants.js";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userApiReducerPath } from "../../features/api/userApi.js";
import useToast from "../../hooks/useToast.js";
import { toast } from "react-toastify";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast();
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState({
    type: "",
    message: "",
  });
  const loginHandler = async (e) => {
    e.preventDefault();
    console.log("login is running!!");
    if (!emailRegex.test(loginInfo.email)) {
      setError({
        type: "email",
        message: "Please Enter Valid Email!",
      });
      return;
    }
    if (!passwordRegex.test(loginInfo.password)) {
      console.log(loginInfo.password);
      setError({
        type: "password",
        message: "",
      });
      return;
    }

    try {
      const result = await userLogin({ ...loginInfo }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
      // toast(result?.data?.message);
      localStorage.setItem("accessToken", result.accessToken);
      if (
        localStorage.getItem("accessToken") !== undefined ||
        localStorage.getItem("accessToken") !== null
      ) {
        console.log(
          "access token stored : ",
          localStorage.getItem("accessToken")
        );
        dispatch({
          type: `${userApiReducerPath}/invalidateTags`,
          payload: ["login", "userInfo"],
        });
        setLoginInfo({
          email: "",
          password: "",
        });
      }
      navigate("/app");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="login_component" onSubmit={loginHandler}>
      <InputError
        err={error}
        setError={setError}
        setLoginState={setLoginInfo}
        state={loginInfo}
        auth="login"
      />
      <div className="login_input_div">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter Email ..."
          value={loginInfo.email}
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })
          }
        />
      </div>
      <div className="login_input_div">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password ..."
          value={loginInfo.password}
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })
          }
          minLength={8}
          required
          autoComplete="off"
        />
      </div>
      <button type="submit" className="login_button">
        {isLoading ? <Loader /> : "Login"}
      </button>
    </form>
  );
};
export default Login;

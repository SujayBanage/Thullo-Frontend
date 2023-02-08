import "./Signup.css";
import { useState } from "react";
import { IoMdImage, IoIosCloseCircle } from "react-icons/io";
import { useUserSignupMutation } from "../../features/api/authApi.js";
import InputError from "../InputError/InputError";
import { emailRegex, passwordRegex } from "../../constants.js";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userApiReducerPath } from "../../features/api/userApi.js";
import useToast from "../../Hooks/useToast.js";
const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast();
  const [userSignup, { isLoading, isSuccess }] = useUserSignupMutation();
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    profile_image: null,
    password: "",
  });
  const [error, setError] = useState({
    type: "",
    message: "",
  });
  const [imageDrag, setImageDrag] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const imageDropHandler = (e) => {
    e.preventDefault();
    console.log("image drop handler running!!!");
    console.log(e.dataTransfer.files);
    setFileToBase64(e.dataTransfer.files[0]);
    setProfileImagePreview(URL.createObjectURL(e.dataTransfer.files[0]));
  };

  const imageDragOverHandler = (e) => {
    console.log("image drag handler running!!!");
    e.preventDefault();
    console.log(e.dataTransfer.files);
    setImageDrag(true);
  };

  const imageDragLeaveHandler = (e) => {
    setImageDrag(false);
  };

  const inputImageSelect = (e) => {
    setFileToBase64(e.target.files[0]);
    setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (emailRegex.test(signupInfo.email) === false) {
      console.log(signupInfo.email);
      setError({
        type: "email",
        message: "Please Enter Valid Email!",
      });
      return;
    }
    if (passwordRegex.test(signupInfo.password) === false) {
      setError({
        type: "password",
        message: "",
      });
      return;
    }

    if (signupInfo.profile_image === null) {
      setError({
        type: "profile",
        message: "Please Select/Drop the profile image",
      });
      return;
    }

    try {
      const result = await userSignup({
        email: signupInfo.email,
        password: signupInfo.password,
        username: signupInfo.username,
        profileImage: signupInfo.profile_image,
      }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
      localStorage.setItem("accessToken", result.accessToken);
      if (
        localStorage.getItem("accessToken") !== undefined ||
        localStorage.getItem("accessToken") !== null
      ) {
        setSignupInfo({
          email: "",
          password: "",
          username: "",
          profile_image: null,
        });
      }
      dispatch({
        type: `${userApiReducerPath}/invalidateTags`,
        payload: ["signup", "userInfo"],
      });
      setProfileImagePreview("");
      navigate("/app");
    } catch (err) {
      console.log(err.message);
    }
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSignupInfo({ ...signupInfo, profile_image: reader.result });
    };
  };

  return (
    <form className="signup_component" onSubmit={signupHandler}>
      {/* {error.message && error.type && ( */}
      <InputError
        err={error}
        setError={setError}
        state={signupInfo}
        setSignupState={setSignupInfo}
        auth="signup"
      />
      {/* )} */}
      <div className="signup_input_div">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter Username ..."
          value={signupInfo.username}
          onChange={(e) =>
            setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value })
          }
          required
        />
      </div>
      <div className="signup_input_div">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter Email ..."
          value={signupInfo.email}
          onChange={(e) =>
            setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value })
          }
          required
        />
      </div>
      <div className="signup_input_div">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password ..."
          value={signupInfo.password}
          onChange={(e) =>
            setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value })
          }
          minLength={8}
          required
          autoComplete="off"
        />
      </div>
      {profileImagePreview && (
        <div className="profile_image_preview_container">
          <button
            className="cancel_image_button"
            onClick={() => {
              setSignupInfo({ ...signupInfo, profile_image: null });
              setProfileImagePreview("");
            }}
          >
            <IoIosCloseCircle />
          </button>
          <a href={profileImagePreview}>
            <img className="profile_image_preview" src={profileImagePreview} />
          </a>
        </div>
      )}

      <label
        droppable="true"
        onDragOver={imageDragOverHandler}
        onDrop={imageDropHandler}
        onDragLeave={imageDragLeaveHandler}
        htmlFor="profile_image"
        className={
          imageDrag === true
            ? "profile_image_drop_zone_active"
            : "profile_image_drop_zone"
        }
      >
        <span>Drop Or Select Profile Image</span>
        <IoMdImage className="profile_image_icon" />
        <input
          onChange={inputImageSelect}
          type="file"
          id="profile_image"
          name="profile_image"
          // value={signupInfo.profile_image}
          hidden
        />
      </label>
      <button type="submit" className="signup_button">
        {isLoading ? <Loader /> : "Signup"}
      </button>
    </form>
  );
};
export default Signup;

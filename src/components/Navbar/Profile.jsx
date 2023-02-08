import "./Profile.css";
import ProfileOptions from "./ProfileOptions";
import { AiFillCaretDown } from "react-icons/ai";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectGetUserInfoResults } from "../../features/api/userApi.js";
import Loader from "../Loader/Loader.jsx";
const Profile = () => {
  const [profileOptionsActive, setProfileOptionsActive] = useState(false);
  const { data, isLoading, isUninitialized } = useSelector(
    selectGetUserInfoResults
  );

  if (isLoading || isUninitialized) {
    return <Loader />;
  }

  return (
    <div className="profile_container">
      {profileOptionsActive ? (
        <ProfileOptions
          optionsState={profileOptionsActive}
          setOptionsState={setProfileOptionsActive}
        />
      ) : null}
      <div className="profile_image_container">
        <img src={data?.user?.profileImage} className="profile_image" />
      </div>
      <span>{data?.user?.username}</span>
      <button
        className="profile_options_button"
        onClick={() => {
          setProfileOptionsActive(!profileOptionsActive);
        }}
      >
        <AiFillCaretDown />
      </button>
    </div>
  );
};
export default Profile;

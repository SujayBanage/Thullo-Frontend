import "./BoardInvite.css";
import { IoMdSearch } from "react-icons/io";
import { useInviteUserMutation } from "../../features/api/boardApi.js";
import { useLazyGetUsersQuery } from "../../features/api/userApi.js";
import { useState } from "react";
import Loader from "../Loader/Loader.jsx";
import useToast from "../../Hooks/useToast";
const User = ({ _id, username, profileImage, setSelectedUser }) => {
  return (
    <div className="user">
      <img src={profileImage} className="profile_pic" />
      <span>{username}</span>
      <input
        type="checkbox"
        value={_id}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedUser({
              _id,
              profileImage,
            });
          } else {
            setSelectedUser({
              _id: "",
              profileImage: "",
            });
          }
        }}
      />
    </div>
  );
};

const BoardInvite = ({ board_id }) => {
  const Toast = useToast();
  const [searchText, setSearchText] = useState("");
  const [inviteUser, options] = useInviteUserMutation();
  const [getUsers, { data, isLoading, isFetching }] = useLazyGetUsersQuery();
  const [selectedUser, setSelectedUser] = useState({
    _id: "",
    profileImage: "",
  });

  const inviteUserHandler = async () => {
    if (selectedUser._id === "" || selectedUser.profileImage === "") {
      return;
    }
    try {
      const result = await inviteUser({
        board_id,
        invite_user_id: selectedUser._id,
        profileImage: selectedUser.profileImage,
      }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUsersHandler = () => {
    getUsers(searchText);
    setSearchText("");
  };

  return (
    <div className="board_invite_container">
      <div className="board_invite_search">
        <input
          type="text"
          placeholder="User..."
          className="board_invite_input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="board_invite_search_button"
          onClick={getUsersHandler}
        >
          <IoMdSearch />
        </button>
      </div>
      <div className="invite_users">
        {isFetching || isLoading ? (
          <Loader />
        ) : data?.users?.length > 0 ? (
          data?.users?.map((user) => {
            return (
              <User
                key={user._id}
                _id={user._id}
                username={user.username}
                profileImage={user.profileImage}
                board_id={board_id}
                setSelectedUser={setSelectedUser}
              />
            );
          })
        ) : (
          <span>No Users Found!</span>
        )}
      </div>
      <button className="invite_button" onClick={inviteUserHandler}>
        {options.isLoading ? <Loader /> : "Invite"}
      </button>
    </div>
  );
};

export default BoardInvite;

import { lazy, useState, Suspense } from "react";
import { IoMdLock } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import { MdPublic } from "react-icons/md";
import "./BoardHeader.css";
import Loader from "../Loader/Loader";
// import BoardVisibility from "./BoardVisibility";
// import BoardInvite from "./BoardInvite";
const BoardVisibility = lazy(() => import("./BoardVisibility.jsx"));
const BoardInvite = lazy(() => import("./BoardInvite.jsx"));

const BoardHeader = ({
  showMenu,
  setShowMenu,
  visibility,
  users,
  board_id,
  admin_id,
  user_id,
}) => {
  const [boardVisibilityOptions, setBoardVisibilityOptions] = useState(false);
  const [inviteUser, setInviteUser] = useState(false);

  return (
    <header className="board_header">
      <div className="visibility_and_users">
        {boardVisibilityOptions ? (
          <Suspense fallback={<Loader />}>
            <BoardVisibility
              board_id={board_id}
              setShow={setBoardVisibilityOptions}
            />
          </Suspense>
        ) : null}
        {admin_id === user_id ? (
          <button
            className="board_visibility_change"
            onClick={() => setBoardVisibilityOptions(!boardVisibilityOptions)}
          >
            {visibility === "Public" ? <MdPublic /> : <IoMdLock />}
            <span>{visibility}</span>
          </button>
        ) : null}
        <div className="board_users">
          {users?.length > 0 ? (
            users.map((user) => {
              return (
                <img
                  key={user?.user_id}
                  src={user?.profileImage}
                  className="board_user"
                />
              );
            })
          ) : (
            <span>0+ Users</span>
          )}
          {admin_id === user_id ? (
            <button
              className="new_user_add_button"
              onClick={() => setInviteUser(!inviteUser)}
            >
              <IoMdAdd />
            </button>
          ) : null}
        </div>
        {inviteUser ? (
          <Suspense fallback={<Loader />}>
            <BoardInvite board_id={board_id} />
          </Suspense>
        ) : null}
      </div>
      <button
        className="board_details_button"
        onClick={() => setShowMenu(!showMenu)}
      >
        <SlOptions />
        Show Menu
      </button>
    </header>
  );
};

export default BoardHeader;

import "./BoardInfo.css";
import { useState, lazy, Suspense } from "react";
import { MdClose } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { MdDescription, MdEdit } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { selectGetUserInfoResults } from "../../features/api/userApi.js";
import {
  useUpdateDescriptionMutation,
  useRemoveUserFromBoardMutation,
} from "../../features/api/boardApi.js";
import useToast from "../../Hooks/useToast";
import NotFound from "../NotFound/NotFound.jsx";
import SkeletonInfo from "../skeletonComponents/SkeletonInfo.jsx";
// import ReactQuill from "react-quill";
const ReactQuill = lazy(() => import("react-quill"));
const BoardCreatorInfo = ({ admin, time }) => {
  return (
    <div className="board_creator_info">
      <div className="board_creator_info_heading">
        <FaUserCircle />
        <span>Made By</span>
      </div>
      <div className="board_creator_name_and_img">
        <img src={admin?.profileImage} className="board_creator_img" />
        <div className="board_creator_name_and_date">
          <span>{admin?.username}</span>
          <span>on {new Date(time).toDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const BoardDescription = ({ description, user_id, admin_id, board_id }) => {
  const Toast = useToast();
  const [updateDescription] = useUpdateDescriptionMutation();

  const [editDescription, setEditDescription] = useState(false);
  const [desc, setDesc] = useState(description ? JSON.parse(description) : "");

  console.log("description is : ", JSON.stringify(desc));

  const boardDescriptionUpadteHandler = async () => {
    try {
      const result = await updateDescription({
        board_id,
        description: JSON.stringify(desc),
      });
      console.log("result is : ", result);
      Toast(result?.error, result?.message);
      setEditDescription(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="board_description_component">
      <div className="board_description_heading">
        <MdDescription />
        <span>Description</span>
        {!editDescription && user_id === admin_id && (
          <button
            className="board_description_edit_button"
            onClick={() => setEditDescription(!editDescription)}
          >
            <MdEdit />
            <span>Edit</span>
          </button>
        )}
      </div>
      <div className="board_description">
        {desc === "" && !editDescription && (
          <NotFound message="No Description Yet" />
        )}
        {!editDescription && (
          <div dangerouslySetInnerHTML={!editDescription && { __html: desc }} />
        )}
        {editDescription && (
          <div className="board_description_edit">
            <Suspense fallback={<SkeletonInfo />}>
              <ReactQuill theme="snow" value={desc} onChange={setDesc} />
            </Suspense>

            <div className="description_edit_buttons">
              <button
                className="description_save_button"
                onClick={boardDescriptionUpadteHandler}
              >
                save
              </button>
              <button
                className="description_cancel_button"
                onClick={() => {
                  setEditDescription(false);
                  setDesc(JSON.parse(description));
                }}
              >
                cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BoardUsers = ({ users, admin, user_id, board_id }) => {
  const Toast = useToast();
  const [removeUserFromBoard] = useRemoveUserFromBoardMutation();

  const removeUserHandler = async (e) => {
    try {
      const result = await removeUserFromBoard({
        user_id: e.target.dataset.user_id,
        board_id,
      }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="board_info_users">
      <div className="board_info_users_heading">
        <HiUserGroup />
        <span>Team</span>
      </div>
      <div className="board_info_users_container">
        {users?.length > 0 ? (
          users?.map((user) => {
            return (
              <div key={user?.user_id} className="board_info_user_wrapper">
                <img src={user?.profileImage} className="board_info_user_img" />
                <span className="board_info_user_name">{user?.username}</span>
                {user_id === admin.user_id ? (
                  <button
                    data-user_id={user?.user_id}
                    className="board_info_user_remove_button"
                    onClick={removeUserHandler}
                  >
                    remove
                  </button>
                ) : null}
              </div>
            );
          })
        ) : (
          <NotFound message="No Users Yet" />
        )}
      </div>
    </div>
  );
};

const BoardInfo = ({ setShowMenu, board }) => {
  const { data } = useSelector(selectGetUserInfoResults);
  return (
    <div className="board_info_container">
      <header className="board_heading">
        <span>{board?.name}</span>
        <button
          className="board_info_close_button"
          onClick={() => setShowMenu(false)}
        >
          <MdClose />
        </button>
      </header>
      <BoardCreatorInfo admin={board?.admin} time={board?.createdAt} />
      <BoardDescription
        board_id={board?._id}
        description={board?.description}
        user_id={data?.user?._id}
        admin_id={board?.admin.user_id}
      />
      <BoardUsers
        users={board?.users}
        admin={board?.admin}
        board_id={board?._id}
        user_id={data?.user?._id}
      />
    </div>
  );
};

export default BoardInfo;

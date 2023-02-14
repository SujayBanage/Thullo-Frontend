import { IoMdAdd } from "react-icons/io";
import "./AddMember.css";
import AddMemberComponent from "./AddMemberComponent";
import { useState } from "react";
import { useRemoveUserFromTaskMutation } from "../../features/api/taskApi.js";
import useToast from "../../Hooks/useToast";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";

const AddMember = ({ task_users, task_id, board_id }) => {
  const toast = useToast();
  const [assignMemberShow, setAssignMemberShow] = useState(false);
  const [removeUser, { isLoading }] = useRemoveUserFromTaskMutation();

  const removeUserHandler = async (e) => {
    try {
      const removeUserResult = await removeUser({
        task_id,
        user_id: e.target.dataset.user_id,
      }).unwrap();
      console.log(removeUserResult);
      toast(false, removeUserResult.message);
    } catch (err) {
      toast(true, err.message);
    }
  };

  return (
    <div className="add_member_container">
      <div className="members_list">
        {task_users?.length > 0 ? (
          task_users?.map((user) => {
            return (
              <div className="board_members">
                <img src={user?.profileImage} className="board_members_img" />
                <span className="board_members_name">{user?.username}</span>
                <button
                  onClick={removeUserHandler}
                  className="remove_task_user"
                  data-user_id={user.user_id}
                >
                  {isLoading ? <Loader /> : "remove"}
                </button>
              </div>
            );
          })
        ) : (
          <NotFound message="No Task Members Yet" />
        )}
      </div>
      <button
        className="add_member_button"
        onClick={() => {
          setAssignMemberShow(!assignMemberShow);
        }}
      >
        <span>Assign Member</span>
        <IoMdAdd />
      </button>
      {assignMemberShow && (
        <AddMemberComponent
          task_users={task_users}
          task_id={task_id}
          board_id={board_id}
        />
      )}
    </div>
  );
};

export default AddMember;

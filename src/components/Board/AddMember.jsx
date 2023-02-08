import { IoMdAdd } from "react-icons/io";
import "./AddMember.css";
import AddMemberComponent from "./AddMemberComponent";
import { useState } from "react";
const AddMember = ({ task_users, task_id, board_id }) => {
  const [assignMemberShow, setAssignMemberShow] = useState(false);

  return (
    <div className="add_member_container">
      <div className="members_list">
        {task_users?.length > 0 ? (
          task_users?.map((user) => {
            return (
              <div className="board_members">
                <img src={user?.profileImage} className="board_members_img" />
                <span className="board_members_name">{user?.username}</span>
              </div>
            );
          })
        ) : (
          <span>No Members</span>
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

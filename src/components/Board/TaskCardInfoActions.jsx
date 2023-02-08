import { useState } from "react";
import "./TaskCardInfoActions.css";
import { FaUserCircle } from "react-icons/fa";
import { MdImage, MdLabel } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import CoverSelection from "./CoverSelection";
import LableSelection from "./LableSelection";
import AddMember from "./AddMember";

const TaskCardInfoActions = ({
  task_users,
  task_id,
  board_id,
  setCoverPic,
  task_labels,
}) => {
  const [showCoverSelection, setShowCoverSelection] = useState(false);
  const [showLableSelection, setShowLableSelection] = useState(false);
  const [showUserSelection, setShowUserSelection] = useState(false);

  return (
    <div className="task_card_info_actions">
      <h3 className="task_card_info_actions_headings">
        <FaUserCircle />
        Actions
      </h3>
      <div className="task_card_info_actions_buttons">
        <button
          className="task_card_cover_button"
          onClick={() => setShowCoverSelection(!showCoverSelection)}
        >
          <MdImage />
          <span>Cover</span>
        </button>
        {showCoverSelection && (
          <CoverSelection task_id={task_id} setCoverPic={setCoverPic} />
        )}
        <button
          className="task_card_label_button"
          onClick={() => setShowLableSelection(!showLableSelection)}
        >
          <MdLabel />
          <span>Labels</span>
        </button>
        {showLableSelection && (
          <LableSelection task_id={task_id} task_labels={task_labels} />
        )}
        <button
          className="task_card_members_button"
          onClick={() => {
            setShowUserSelection(!showUserSelection);
          }}
        >
          <FaUsers />
          <span>Members</span>
        </button>
        {showUserSelection && (
          <AddMember
            task_users={task_users}
            task_id={task_id}
            board_id={board_id}
          />
        )}
      </div>
    </div>
  );
};

export default TaskCardInfoActions;

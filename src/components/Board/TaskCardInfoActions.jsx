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
  const [showCoverSelection, setShowCoverSelection] = useState(
    window.innerWidth > 600 ? false : true
  );
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
          onClick={() => {
            setShowCoverSelection(!showCoverSelection);
            setShowLableSelection(false);
            setShowUserSelection(false);
          }}
        >
          <MdImage />
          <span>Cover</span>
        </button>
        {showCoverSelection && window.innerWidth > 600 && (
          <CoverSelection task_id={task_id} setCoverPic={setCoverPic} />
        )}
        <button
          className="task_card_label_button"
          onClick={() => {
            setShowLableSelection(!showLableSelection);
            setShowCoverSelection(false);
            setShowUserSelection(false);
          }}
        >
          <MdLabel />
          <span>Labels</span>
        </button>
        {showLableSelection && window.innerWidth > 600 && (
          <LableSelection task_id={task_id} task_labels={task_labels} />
        )}
        <button
          className="task_card_members_button"
          onClick={() => {
            setShowUserSelection(!showUserSelection);
            setShowCoverSelection(false);
            setShowLableSelection(false);
          }}
        >
          <FaUsers />
          <span>Members</span>
        </button>
        {showUserSelection && window.innerWidth > 600 && (
          <AddMember
            task_users={task_users}
            task_id={task_id}
            board_id={board_id}
          />
        )}
      </div>
      {window.innerWidth <= 600 ? (
        <div className="task_card_info_actions_mobile">
          {showCoverSelection && (
            <CoverSelection task_id={task_id} setCoverPic={setCoverPic} />
          )}
          {showLableSelection && (
            <LableSelection task_id={task_id} task_labels={task_labels} />
          )}
          {showUserSelection && (
            <AddMember
              task_users={task_users}
              task_id={task_id}
              board_id={board_id}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TaskCardInfoActions;

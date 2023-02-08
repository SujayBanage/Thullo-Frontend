import "./TaskCardInfo.css";
import { IoCloseOutline } from "react-icons/io5";
import { selectGetUserInfoResults } from "../../features/api/userApi.js";
import { useSelector } from "react-redux";
import { lazy, useState, Suspense } from "react";
import { useUpdateTaskNameMutation } from "../../features/api/taskApi.js";
import SkeletonInfo from "../skeletonComponents/SkeletonInfo";
// import TaskCardInfoDescription from "./TaskCardInfoDescription";
// import TaskCardInfoActions from "./TaskCardInfoActions";
// import TaskCardInfoAttachments from "./TaskCardInfoAttachments";
// import TaskCardInfoComments from "./TaskCardInfoComments";

const TaskCardInfoDescription = lazy(() =>
  import("./TaskCardInfoDescription.jsx")
);
const TaskCardInfoActions = lazy(() => import("./TaskCardInfoActions.jsx"));
const TaskCardInfoAttachments = lazy(() =>
  import("./TaskCardInfoAttachments.jsx")
);
const TaskCardInfoComments = lazy(() => import("./TaskCardInfoComments.jsx"));

const TaskCardInfo = ({ board_id, task, setShowInfo }) => {
  const [updateTaskName] = useUpdateTaskNameMutation();
  const [changeTaskName, setChangeTaskName] = useState(false);

  const [newTaskName, setNewTaskName] = useState("");

  const result = useSelector(selectGetUserInfoResults);
  console.log("user is : ", result);

  const checkIfUser = (user_id) => {
    for (let user of task?.users) {
      if (user_id === user.user_id) {
        return true;
      }
    }
    return false;
  };

  const updateTaskNameHandler = async () => {
    try {
      const result = await updateTaskName({
        task_id: task?._id,
        name: newTaskName,
      }).unwrap();
      console.log(result);
      setChangeTaskName("");
      setChangeTaskName(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="task_card_info_container">
      <button
        className="task_card_info_close"
        onClick={() => setShowInfo(false)}
      >
        <IoCloseOutline />
      </button>
      {task?.image && <img src={task?.image} className="task_card_info_img" />}
      <div className="task_card_info_content">
        <div className="task_card_info_content_wrapper">
          <h3
            className="task_name"
            onClick={() => setChangeTaskName(!changeTaskName)}
          >
            {task?.name}
          </h3>
          {changeTaskName && (
            <div className="change_task_name_container">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Rename Task....."
              />
              <div className="change_task_name_buttons">
                <button
                  className="change_task_name_rename_button"
                  onClick={updateTaskNameHandler}
                >
                  Rename
                </button>
                <button
                  className="change_task_name_cancel_button"
                  onClick={() => setChangeTaskName(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <Suspense fallback={<SkeletonInfo />}>
            <TaskCardInfoDescription
              task_id={task?._id}
              description={task?.description}
              admin={task?.admin}
              user_id={result?.data?.user?._id}
            />
          </Suspense>
          <Suspense fallback={<SkeletonInfo />}>
            <TaskCardInfoAttachments
              task_id={task?._id}
              attachments={task?.attachments}
              admin={task?.admin}
              user_id={result?.data?.user?._id}
              checkIfUser={checkIfUser}
            />
          </Suspense>
          <Suspense fallback={<SkeletonInfo />}>
            <TaskCardInfoComments
              task_id={task?._id}
              comments={task?.comments}
              admin={task?.admin}
              user_id={result?.data?.user?._id}
              profileImage={result?.data?.user?.profileImage}
              checkIfUser={checkIfUser}
            />
          </Suspense>
        </div>
        {result?.data?.user?._id === task.admin ||
        checkIfUser(result?.data?.user?._id) ? (
          <Suspense fallback={<SkeletonInfo />}>
            <TaskCardInfoActions
              task_users={task?.users}
              board_id={board_id}
              task_id={task?._id}
              task_labels={task?.labels}
              admin={task?.admin}
              user_id={result?.data?.user?._id}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};
export default TaskCardInfo;

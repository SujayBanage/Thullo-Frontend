import "./TaskCard.css";
import { lazy, useState, Suspense } from "react";
import { MdComment } from "react-icons/md";
import { IoMdAttach } from "react-icons/io";
import { useGetTaskByIdQuery } from "../../features/api/taskApi.js";
import { AiFillDelete } from "react-icons/ai";
import { useDeleteTaskMutation } from "../../features/api/taskApi.js";
import useToast from "../../Hooks/useToast.js";
import SkeletonCard from "../skeletonComponents/SkeletonCard.jsx";
// import { Draggable } from "react-beautiful-dnd";

// import Portal from "../Portal/Portal.jsx";
// import TaskCardInfo from "./TaskCardInfo";
import ScreenLoader from "../ScreenLoader/ScreenLoader.jsx";
import Loader from "../Loader/Loader";
const Portal = lazy(() => import("../Portal/Portal.jsx"));
const TaskCardInfo = lazy(() => import("./TaskCardInfo.jsx"));
const Draggable = lazy(() =>
  import("react-beautiful-dnd").then((module) => {
    return { default: module.Draggable };
  })
);
const TaskTag = ({ label }) => {
  return (
    <div className="task_tag" data-color={label.color}>
      <span>{label.text}</span>
    </div>
  );
};
const TaskCard = ({
  column_id,
  task_id,
  board_id,
  index,
  user_id,
  admin_id,
}) => {
  const Toast = useToast();
  const [deleteTask, deleteTaskObj] = useDeleteTaskMutation();
  const { data, isLoading, isFetching } = useGetTaskByIdQuery(task_id);
  const [showInfo, setShowInfo] = useState(false);
  const deleteTaskHandler = async () => {
    try {
      const result = await deleteTask({ task_id, column_id }).unwrap();
      Toast(result?.error, result?.message);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading || isFetching) {
    return <SkeletonCard />;
  }

  return (
    <Suspense fallback={<SkeletonCard />}>
      {user_id === admin_id ? (
        <Draggable key={task_id} draggableId={task_id} index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className="task_card_container"
            >
              {admin_id === user_id && (
                <button
                  className="task_delete_button"
                  onClick={deleteTaskHandler}
                >
                  <AiFillDelete />
                </button>
              )}
              {data?.task?.image && (
                <img src={data?.task?.image} className="task_card_img" />
              )}
              <span
                className="task_title"
                onClick={() => setShowInfo(!showInfo)}
              >
                {data?.task?.name}
              </span>
              <div className="task_tags_container">
                {data?.task?.labels?.length > 0
                  ? data?.task?.labels?.map((label, index) => {
                      if (index <= 3) {
                        return <TaskTag label={label} />;
                      }
                      if (index === data?.task?.labels?.length - 1) {
                        return (
                          <span>{data?.task?.labels?.length - 4} more</span>
                        );
                      }
                    })
                  : null}
              </div>
              <div className="task_info">
                <div className="task_users">
                  {data?.task?.users?.length > 0
                    ? data?.task?.users?.map((user) => {
                        return (
                          <img
                            key={user?.user_id}
                            src={user?.profileImage}
                            className="task_user"
                          />
                        );
                      })
                    : null}
                </div>
                <div className="task_comments_and_attachments">
                  <MdComment />
                  <span>{data?.task?.comments?.length}</span>
                  <IoMdAttach />
                  <span>{data?.task?.attachments?.length}</span>
                </div>
              </div>
              {showInfo && (
                <Suspense fallback={<ScreenLoader />}>
                  <Portal>
                    <TaskCardInfo
                      task={data?.task}
                      board_id={board_id}
                      setShowInfo={setShowInfo}
                    />
                  </Portal>
                </Suspense>
              )}
            </div>
          )}
        </Draggable>
      ) : (
        <div
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
          // ref={provided.innerRef}
          className="task_card_container"
        >
          {admin_id === user_id && (
            <button className="task_delete_button" onClick={deleteTaskHandler}>
              {deleteTaskObj.isLoading ? <Loader /> : <AiFillDelete />}
            </button>
          )}
          {data?.task?.image && (
            <img src={data?.task?.image} className="task_card_img" />
          )}
          <span className="task_title" onClick={() => setShowInfo(!showInfo)}>
            {data?.task?.name}
          </span>
          <div className="task_tags_container">
            {data?.task?.labels?.length > 0
              ? data?.task?.labels?.map((label, index) => {
                  if (index <= 3) {
                    return <TaskTag label={label} />;
                  }
                  if (index === data?.task?.labels?.length - 1) {
                    return <span>{data?.task?.labels?.length - 4} more</span>;
                  }
                })
              : null}
          </div>
          <div className="task_info">
            <div className="task_users">
              {data?.task?.users?.length > 0
                ? data?.task?.users?.map((user) => {
                    return (
                      <img
                        key={user?.user_id}
                        src={user?.profileImage}
                        className="task_user"
                      />
                    );
                  })
                : null}
            </div>
            <div className="task_comments_and_attachments">
              <MdComment />
              <span>{data?.task?.comments?.length}</span>
              <IoMdAttach />
              <span>{data?.task?.attachments?.length}</span>
            </div>
          </div>
          {showInfo && (
            <Suspense fallback={<ScreenLoader />}>
              <Portal>
                <TaskCardInfo
                  task={data?.task}
                  board_id={board_id}
                  setShowInfo={setShowInfo}
                />
              </Portal>
            </Suspense>
          )}
        </div>
      )}
    </Suspense>
  );
};

export default TaskCard;

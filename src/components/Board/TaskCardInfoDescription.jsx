import { MdDescription, MdEdit } from "react-icons/md";
import { useState, lazy, Suspense } from "react";
import "./TaskCardInfoDescription.css";
import "react-quill/dist/quill.snow.css";
import { useUpdateDescriptionMutation } from "../../features/api/taskApi.js";
import NotFound from "../NotFound/NotFound.jsx";
import { react_quill_modules } from "../../constants.js";
// import ReactQuill from "react-quill";
import SkeletonInfo from "../skeletonComponents/SkeletonInfo.jsx";
const ReactQuill = lazy(() => import("react-quill"));

const TaskCardInfoDescription = ({ task_id, description, admin, user_id }) => {
  const [edit, setEdit] = useState(false);
  const [taskDescription, setTaskDescription] = useState(
    description ? JSON.parse(description) : ""
  );
  const [updateDescription] = useUpdateDescriptionMutation();

  const descriptionUpdateHandler = async () => {
    try {
      const result = await updateDescription({
        task_id,
        description: JSON.stringify(taskDescription),
      });
      console.log(result);
      setEdit(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="task_card_info_description">
      <div className="task_card_info_description_heading">
        <MdDescription />
        <span>Description</span>

        {admin === user_id ? (
          <button
            className="task_card_info_description_edit_button"
            onClick={() => setEdit(!edit)}
          >
            <MdEdit />
            <span>Edit</span>
          </button>
        ) : null}
      </div>
      <div className="task_card_info_description_content">
        {taskDescription === "" && !edit && (
          <NotFound message="No Description Yet" />
        )}
        {!edit && (
          <div
            className="task_description_div"
            dangerouslySetInnerHTML={{ __html: taskDescription }}
          />
        )}

        {edit && (
          <div className="task_card_info_description_edit_area">
            <Suspense fallback={<SkeletonInfo />}>
              <ReactQuill
                className="text_editor"
                value={taskDescription}
                onChange={setTaskDescription}
                modules={react_quill_modules}
              ></ReactQuill>
            </Suspense>
            <div className="task_card_info_description_edit_buttons">
              <button onClick={descriptionUpdateHandler}>save</button>
              <button onClick={() => setEdit(false)}>cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCardInfoDescription;

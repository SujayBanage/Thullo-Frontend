import "./BoardContent.css";
import { IoMdAdd } from "react-icons/io";
import { lazy, useState, Suspense } from "react";
import { useCreateColumnMutation } from "../../features/api/boardApi.js";
import NotFound from "../NotFound/NotFound";
// import { DragDropContext } from "react-beautiful-dnd";
import { useShiftTaskMutation } from "../../features/api/taskApi.js";
import useToast from "../../Hooks/useToast.js";
import SkeletonColumn from "../skeletonComponents/SkeletonColumn";
// import Column from "./Column";

const DragDropContext = lazy(() =>
  import("react-beautiful-dnd").then((module) => {
    return { default: module.DragDropContext };
  })
);

// const useCreateColumnMutation = lazy(() =>
//   import("../../features/api/boardApi.js").then((module) => {
//     return { default: module.useCreateColumnMutation };
//   })
// );

// const useShiftTaskMutation = lazy(() =>
//   import("../../features/api/taskApi.js").then((module) => {
//     return { default: module.useShiftTaskMutation };
//   })
// );

const Column = lazy(() => import("./Column"));

const BoardContent = ({ columns, board_id, admin_id, user_id }) => {
  const Toast = useToast();
  const [columnAdd, setColumnAdd] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [createColumn] = useCreateColumnMutation();
  const [shiftTask] = useShiftTaskMutation();
  const columnCreateHandler = async () => {
    try {
      const result = await createColumn({
        name: columnName,
        board_id,
      }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
      setColumnAdd(false);
      setColumnName("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnDragEnd = async (result) => {
    console.log("drag result ", result);
    const { source, destination, draggableId } = result;
    const fromColumnId = source.droppableId;
    const toColumnId = destination.droppableId;
    const task_id = draggableId;
    const fromTaskIndex = source.index;
    const toTaskIndex = destination.index;

    try {
      const result = await shiftTask({
        fromColumnId,
        toColumnId,
        task_id,
        fromTaskIndex,
        toTaskIndex,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="board_content">
      <Suspense fallback={<SkeletonColumn />}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <section className="board_columns_container">
            {columns?.length > 0 ? (
              columns?.map((column) => (
                <Suspense fallback={<SkeletonColumn />}>
                  <Column
                    key={column?.column_id}
                    column_id={column?.column_id}
                    name={column?.name}
                    board_id={board_id}
                    admin_id={admin_id}
                    user_id={user_id}
                  />
                </Suspense>
              ))
            ) : (
              <NotFound type="columns" message="No Task Lists Yet" />
            )}
          </section>
        </DragDropContext>
      </Suspense>
      {admin_id === user_id ? (
        <div className="new_column_create_container">
          <button
            className="column_add_button"
            onClick={() => setColumnAdd(!columnAdd)}
          >
            <span>Add Another List</span>
            <IoMdAdd />
          </button>
          {columnAdd && (
            <div className="column_create_container">
              <input
                type="text"
                className="column_create_input"
                placeholder="Enter title for the column"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
              />
              <div className="column_buttons">
                <button
                  className="column_create_save"
                  onClick={columnCreateHandler}
                >
                  save
                </button>
                <button
                  className="column_create_cancel"
                  onClick={() => {
                    setColumnAdd(false);
                    setColumnName("");
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
};

export default BoardContent;

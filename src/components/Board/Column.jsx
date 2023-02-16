import { lazy, useContext, useEffect, useState, Suspense } from "react";
import { SlOptions } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import "./Column.css";
import {
  useUpdateColumnMutation,
  useDeleteColumnMutation,
} from "../../features/api/boardApi.js";
import {
  useCreateTaskMutation,
  useGetTasksByColumnIdQuery,
} from "../../features/api/taskApi.js";
// import { StrictModeDroppable as Droppable } from "../../helpers/StrictModeDroppable.jsx";

import useToast from "../../Hooks/useToast";
import SkeletonCard from "../skeletonComponents/SkeletonCard.jsx";
import Loader from "../Loader/Loader";
import TaskCard from "./TaskCard";
import { socketCxt } from "../../context/socketContext.jsx";
import SkeletonColumn from "../skeletonComponents/SkeletonColumn";

const Droppable = lazy(() =>
  import("../../helpers/StrictModeDroppable.jsx").then((module) => {
    return { default: module.StrictModeDroppable };
  })
);

const ColumnOptions = ({
  columnNameReset,
  setColumnNameReset,
  setColumnOptions,
  column_id,
  board_id,
}) => {
  const Toast = useToast();
  const [deleteColumn] = useDeleteColumnMutation();

  const deleteColumnHandler = async () => {
    try {
      const result = await deleteColumn({ column_id, board_id }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="column_options_container">
      <button
        className="column_option"
        onClick={() => {
          setColumnNameReset(!columnNameReset);
          setColumnOptions(false);
        }}
      >
        Rename
      </button>
      <button className="column_option" onClick={deleteColumnHandler}>
        Delete This List
      </button>
    </div>
  );
};

const NewCard = ({ setAddNewCard, column_id }) => {
  const Toast = useToast();
  const [cardName, setCardName] = useState("");
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const createTaskHandler = async () => {
    try {
      const result = await createTask({ name: cardName, column_id }).unwrap();
      Toast(result?.error, result?.message);
      setAddNewCard(false);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="new_card">
      <input
        className="new_card_input"
        type="text"
        placeholder="Enter Title For This Card"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />
      <div>
        <button className="new_card_save" onClick={createTaskHandler}>
          {isLoading ? <Loader /> : "save"}
        </button>
        <button
          className="new_card_cancel"
          onClick={() => setAddNewCard(false)}
        >
          cancel
        </button>
      </div>
    </div>
  );
};

const Column = ({ column_id, name, board_id, admin_id, user_id }) => {
  const Toast = useToast();
  const socket = useContext(socketCxt);
  const [columnOptionsActive, setColumnOptions] = useState(false);
  const [addNewCard, setAddNewCard] = useState(false);
  const [updateColumnName] = useUpdateColumnMutation();
  const [renameText, setRenameText] = useState(name);
  const [columnNameReset, setColumnNameReset] = useState(false);

  const { data, isLoading, isFetching } = useGetTasksByColumnIdQuery(column_id);

  console.log("tasks are : ", data);

  const [allTasks, setAllTasks] = useState(data?.allTasks || []);

  useEffect(() => {
    setAllTasks(data?.allTasks);
  }, [data, column_id]);

  useEffect(() => {
    socket?.on(
      "shift-task-success",
      ({ fromColumnId, fromColumnTasks, toColumnId, toColumnTasks }) => {
        console.log("shift-success-running!");
        if (fromColumnId === column_id) {
          // setAllTasks([...fromColumnTasks]);
          setAllTasks(fromColumnTasks);
        } else if (toColumnId === column_id) {
          // setAllTasks([...toColumnTasks]);
          setAllTasks(toColumnTasks);
        }
      }
    );
    return () => socket.off("shift-task-success");
  }, []);

  const updateColumnNameHandler = async () => {
    try {
      const results = await updateColumnName({
        name: renameText,
        column_id,
        board_id,
      }).unwrap();
      Toast(results?.error, results?.message);
      console.log(results);
      setColumnNameReset(false);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("columns rendered");

  return (
    <Suspense fallback={<SkeletonColumn />}>
      <Droppable key={column_id} droppableId={column_id}>
        {(provided) => (
          <section
            key={column_id}
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="column_container"
          >
            {columnOptionsActive && (
              <ColumnOptions
                columnNameReset={columnNameReset}
                setColumnNameReset={setColumnNameReset}
                setColumnOptions={setColumnOptions}
                column_id={column_id}
                board_id={board_id}
              />
            )}
            <div className="column_name_and_option">
              <span>{name}</span>

              {admin_id === user_id && (
                <button
                  className="column_option_button"
                  onClick={() => {
                    setColumnOptions(!columnOptionsActive);
                    setColumnNameReset(false);
                  }}
                >
                  <SlOptions />
                </button>
              )}
            </div>
            {columnNameReset && (
              <div className="column_rename_div">
                <input
                  type="text"
                  value={renameText}
                  className="rename_column_input"
                  onChange={(e) => setRenameText(e.target.value)}
                />
                <div className="rename_column_buttons">
                  <button
                    className="rename_column_button"
                    onClick={updateColumnNameHandler}
                  >
                    Rename
                  </button>
                  <button
                    className="rename_column_cancel"
                    onClick={() => setColumnNameReset(false)}
                  >
                    cancel
                  </button>
                </div>
              </div>
            )}

            {(isLoading || isFetching) &&
              Array(10)
                .fill()
                .map(() => {
                  return <SkeletonCard />;
                })}

            {allTasks?.length > 0
              ? allTasks?.map((task, index) => {
                  return (
                    <TaskCard
                      index={index}
                      key={task}
                      board_id={board_id}
                      task_id={task}
                      column_id={column_id}
                      user_id={user_id}
                      admin_id={admin_id}
                    />
                  );
                })
              : null}

            {addNewCard && (
              <NewCard column_id={column_id} setAddNewCard={setAddNewCard} />
            )}

            {provided.placeholder}
            {admin_id === user_id ? (
              <button
                className="add_card_button"
                onClick={() => setAddNewCard(!addNewCard)}
              >
                <span>Add Task</span>
                <IoMdAdd />
              </button>
            ) : null}
          </section>
        )}
      </Droppable>
    </Suspense>
  );
};
export default Column;

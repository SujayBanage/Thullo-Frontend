import { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import "./Column.css";
import TaskCard from "./TaskCard";
import {
  useUpdateColumnMutation,
  useDeleteColumnMutation,
} from "../../features/api/boardApi.js";
import {
  useCreateTaskMutation,
  useGetTasksByColumnIdQuery,
} from "../../features/api/taskApi.js";
import { StrictModeDroppable as Droppable } from "../../helpers/StrictModeDroppable.jsx";
import useToast from "../../hooks/useToast";
import SkeletonCard from "../skeletonComponents/SkeletonCard.jsx";

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
  const [createTask] = useCreateTaskMutation();
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
          save
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

const DummyCard = () => {
  return <div className="dummy_card"></div>;
};

const Column = ({ column_id, name, board_id, admin_id, user_id }) => {
  const Toast = useToast();
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
  }, [data]);

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

  return (
    <Droppable droppableId={column_id}>
      {(provided) => (
        <section
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
            <button
              className="column_option_button"
              onClick={() => {
                setColumnOptions(!columnOptionsActive);
                setColumnNameReset(false);
              }}
            >
              <SlOptions />
            </button>
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

          {data?.allTasks?.length > 0
            ? data?.allTasks?.map((task, index) => {
                return (
                  <TaskCard
                    index={index}
                    key={task}
                    board_id={board_id}
                    task_id={task}
                    column_id={column_id}
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
              <span>Add Another Card</span>
              <IoMdAdd />
            </button>
          ) : null}
        </section>
      )}
    </Droppable>
  );
};
export default Column;

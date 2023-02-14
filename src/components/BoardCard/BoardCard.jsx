import "./BoardCard.css";
import { Link } from "react-router-dom";
import {
  useDeleteBoardMutation,
  useUpdateBoardNameMutation,
} from "../../features/api/boardApi.js";
import { useState } from "react";
import { SlOptions } from "react-icons/sl";
import Loader from "../Loader/Loader.jsx";
import { useSelector } from "react-redux";
import { selectGetUserInfoResults } from "../../features/api/userApi.js";
import useToast from "../../Hooks/useToast";
const BoardCard = ({ board }) => {
  const Toast = useToast();
  const [renameState, setRenameState] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [boardOptionsActive, setBoardOptionsActive] = useState(false);
  const [deleteBoard] = useDeleteBoardMutation();
  const [updateName, { isLoading }] = useUpdateBoardNameMutation();

  const results = useSelector(selectGetUserInfoResults);

  // console.log(results);

  const deleteBoardHandler = async () => {
    try {
      const result = await deleteBoard({ board_id: board?._id }).unwrap();
      Toast(result?.error, result?.message);
      console.log(result);
      setBoardOptionsActive(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateNameHandler = async () => {
    if (renameText === "") return;
    try {
      const result = await updateName({
        board_id: board?._id,
        name: renameText,
      }).unwrap();
      Toast(result?.error, result?.message);
      console.log(result);
      setRenameText("");
      setRenameState(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div key={board._id} className="board_card_container">
      {boardOptionsActive && (
        <div className="board_options_container">
          <button
            className="board_option"
            onClick={() => {
              setRenameState(true);
              setBoardOptionsActive(false);
            }}
          >
            Rename
          </button>
          <button className="board_option" onClick={deleteBoardHandler}>
            Delete
          </button>
        </div>
      )}

      {results?.data?.user?._id === board.admin.user_id && (
        <button
          className="board_options_button"
          onClick={() => setBoardOptionsActive(!boardOptionsActive)}
        >
          <SlOptions />
        </button>
      )}
      <Link to={`/app/board/${board?._id}`}>
        <img className="board_image" src={board?.boardCoverImage} />
        {!renameState && <span>{board?.name}</span>}
      </Link>
      {renameState && (
        <div className="board_rename_div">
          <input
            type="text"
            value={renameText}
            onChange={(e) => setRenameText(e.target.value)}
          />
          <div className="board_rename_buttons">
            <button onClick={updateNameHandler} className="board_rename_button">
              Rename
            </button>
            <button
              className="board_rename_cancel"
              onClick={() => setRenameState(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="board_users">
        {board?.users?.length > 0 ? (
          board?.users?.map((user) => {
            return <img className="board_users_img" src={user?.profileImage} />;
          })
        ) : (
          <span>No users yet!</span>
        )}
      </div>
    </div>
  );
};

export default BoardCard;

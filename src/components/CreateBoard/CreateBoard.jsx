import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoMdImage } from "react-icons/io";
import { useCreateBoardMutation } from "../../features/api/boardApi.js";
import Loader from "../Loader/Loader.jsx";
import "./CreateBoard.css";
import useToast from "../../hooks/useToast.js";
const CreateBoard = ({ show, setShow }) => {
  const Toast = useToast();
  const [createBoard, { isSuccess, isLoading, isError }] =
    useCreateBoardMutation();
  const [coverImage, setCoverImage] = useState("");

  const [boardState, setBoardState] = useState({
    name: "",
    visibility: "Private",
    boardCoverImage: "",
  });

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBoardState({ ...boardState, boardCoverImage: reader.result });
    };
  };

  const createBoardHandler = async () => {
    try {
      const result = await createBoard({ ...boardState }).unwrap();
      console.log("result from create board : ", result);
      Toast(result?.error, result?.mesage);
      setBoardState({
        name: "",
        visibility: "",
        boardCoverImage: "",
      });
      setCoverImage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create_board_container">
      {coverImage !== "" && (
        <img className="board_cover_pic" src={coverImage} />
      )}
      <input
        className="board_title_input"
        type="text"
        placeholder="Add Board Title"
        value={boardState.name}
        onChange={(e) => {
          setBoardState({ ...boardState, name: e.target.value });
        }}
      />
      <div className="board_options">
        <label className="cover_image_select" htmlFor="cover_image">
          <IoMdImage />
          <span>Cover</span>
        </label>
        <input
          type="file"
          id="cover_image"
          hidden
          onChange={(e) => {
            console.log(e.target.files[0]);
            setFileToBase64(e.target.files[0]);
            setCoverImage(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <select
          defaultValue={boardState.visibility}
          onChange={(e) =>
            setBoardState({ ...boardState, visibility: e.target.value })
          }
        >
          <option value="Private">Private</option>
          <option value="Public">Public</option>
        </select>
      </div>
      <div className="create_board_buttons">
        <button
          className="create_board_cancel"
          onClick={() => {
            setShow(false);
            setBoardState({ name: "", visibility: "", boardCoverImage: "" });
          }}
        >
          cancel
        </button>
        <button className="create_board" onClick={createBoardHandler}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <IoMdAdd />
              create
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateBoard;

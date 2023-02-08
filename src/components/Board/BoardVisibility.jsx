import "./BoardVisibility.css";
import { IoMdLock } from "react-icons/io";
import { MdPublic } from "react-icons/md";
import { useChangeBoardVisibilityMutation } from "../../features/api/boardApi.js";
import useToast from "../../hooks/useToast";
const BoardVisibility = ({ board_id, setShow }) => {
  const Toast = useToast();
  const [changeVisibility] = useChangeBoardVisibilityMutation();

  const boardVisibilityHandler = async (visibility) => {
    try {
      const result = await changeVisibility({
        visibility,
        board_id,
      }).unwrap();
      Toast(result?.error, result?.message);
      console.log("board visibility result : ", result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="board_visibility">
      <h3>Visibility</h3>
      <span>Choose Who Can See This Board</span>
      <button
        className="public_visibility"
        onClick={() => {
          boardVisibilityHandler("Public");
          setShow(false);
        }}
      >
        <div className="public_visibility_content">
          <MdPublic />
          <span>Public</span>
        </div>
        <span>Anyone on the Internet Can See This</span>
      </button>
      <button
        className="private_visibility"
        onClick={() => {
          boardVisibilityHandler("Private");
          setShow(false);
        }}
      >
        <div className="private_visibility_content">
          <IoMdLock />
          <span>Private</span>
        </div>
        <span>Only Board Members can see this</span>
      </button>
    </div>
  );
};

export default BoardVisibility;

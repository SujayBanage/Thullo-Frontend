import "./Invite.css";
import { IoClose } from "react-icons/io5";
import {
  useJoinBoardMutation,
  useDeleteInviteMutation,
} from "../../features/api/boardApi.js";
import useToast from "../../Hooks/useToast.js";
const Invite = ({ invite }) => {
  const toast = useToast();
  const [joinBoard] = useJoinBoardMutation();
  const [deleteInvite] = useDeleteInviteMutation();

  const joinBoardHandler = async () => {
    try {
      const result = await joinBoard({
        board_id: invite?.board_id,
        invitation_id: invite?._id,
      }).unwrap();
      console.log(result);
      toast(result?.error, result?.message);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteInvitationHandler = async () => {
    try {
      const result = await deleteInvite({ invite_id: invite?._id }).unwrap();
      toast(result?.error, result?.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="invite_component">
      <button className="invite_decline" onClick={deleteInvitationHandler}>
        <IoClose />
      </button>
      <img src={invite?.fromProfileImage} />
      <div className="invite_info">
        <span>{invite?.message}</span>
        <button className="invite_accept" onClick={joinBoardHandler}>
          Accept
        </button>
      </div>
    </div>
  );
};
export default Invite;

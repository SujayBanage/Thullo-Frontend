import "./ProfileOptions.css";
import { AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import { useUserLogoutMutation } from "../../features/api/authApi.js";
import { useNavigate } from "react-router-dom";
const ProfileOptions = ({ optionsState, setOptionsState }) => {
  const [userLogout] = useUserLogoutMutation();
  const navigate = useNavigate();
  const userLogoutHandler = async () => {
    try {
      const result = await userLogout();
      console.log(result);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setOptionsState(!optionsState);
  };

  return (
    <div className="profile_options">
      <div
        className="profile_option"
        onClick={() => setOptionsState(!optionsState)}
      >
        <AiOutlineSetting />
        <span>setting</span>
      </div>
      <div className="profile_option" onClick={userLogoutHandler}>
        <AiOutlineLogout />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default ProfileOptions;

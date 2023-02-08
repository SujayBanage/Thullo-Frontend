import "./InputError.css";
import { IoMdCloseCircle } from "react-icons/io";
const InputError = ({ err, setError, setLoginState, setSignupState, auth }) => {
  if (err.type === "email") {
    return (
      <div className="input_error_component">
        <button
          onClick={() => {
            setError({
              type: "",
              message: "",
            });
            auth === "login"
              ? setLoginState({
                  ...state,
                  email: "",
                })
              : setSignupState({
                  ...state,
                  email: "",
                });
          }}
        >
          <IoMdCloseCircle />
        </button>
        <span>{err.message}</span>
      </div>
    );
  }

  if (err.type === "username") {
    return (
      <div className="input_error_component">
        <button
          onClick={() => {
            setError({
              type: "",
              message: "",
            });
            setSignupState({
              ...state,
              username: "",
            });
          }}
        >
          <IoMdCloseCircle />
        </button>
        <span>{err.message}</span>
      </div>
    );
  }

  if (err.type === "profile") {
    return (
      <div className="input_error_component">
        <button
          onClick={() => {
            setError({
              type: "",
              message: "",
            });
          }}
        >
          <IoMdCloseCircle />
        </button>
        <span>{err.message}</span>
      </div>
    );
  }

  if (err.type === "password") {
    return (
      <div className="input_error_component">
        <button
          onClick={() => {
            setError({
              type: "",
              message: "",
            });
            auth === "login"
              ? setLoginState({
                  ...state,
                  password: "",
                })
              : setSignupState({
                  ...state,
                  password: "",
                });
          }}
        >
          <IoMdCloseCircle />
        </button>
        <span>Password Must Have Minimum 8 characters</span>
        <ul>
          <li>Password Must contain atleast 1 special symbol</li>
          <li>Password Must contain atleast 1 lowercase alphabet[a-z]</li>
          <li>Password Must contain atleast 1 uppercase alphabet [A-Z]</li>
          <li>Password Must contain atleast 1 Number</li>
        </ul>
      </div>
    );
  }

  return null;
};
export default InputError;

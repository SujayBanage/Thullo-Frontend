import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const PrivateRoute = ({ children, type }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("accessToken") && type === "private") {
      navigate("/", { replace: true });
    } else if (localStorage.getItem("accessToken") && type === "auth") {
      navigate("/app", { replace: true });
    }
  }, []);
  return children;
};
export default PrivateRoute;

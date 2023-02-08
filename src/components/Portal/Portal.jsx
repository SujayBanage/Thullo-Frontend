import { createPortal } from "react-dom";
import "./Portal.css";
const Portal = ({ children }) => {
  return createPortal(
    <div className="portal">{children}</div>,
    document.getElementById("portal")
  );
};

export default Portal;

import "./Logo.css";
import logo from "../../assets/images/Logo-small.svg";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link to="/app">
      <div className="navbar_logo_container">
        <img src={logo} className="navbar_logo" />
        <span>Thullo</span>
      </div>
    </Link>
  );
};
export default Logo;

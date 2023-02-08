import notfound from "../../assets/images/empty-box.png";
import "./NotFound.css";
const NotFound = ({ type, message }) => {
  return (
    <div
      className={type === "columns" ? "not_found_large" : "not_found_container"}
    >
      <img
        src={notfound}
        className={
          type === "columns" ? "not_found_image_large" : "not_found_image"
        }
      />
      <span>{message}</span>
    </div>
  );
};

export default NotFound;

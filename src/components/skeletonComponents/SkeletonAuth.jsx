import "./SkeletonAuth.css";
const SkeletonAuth = ({ type }) => {
  if (type === "signup") {
    return (
      <div className="skeleton_signup">
        <div className="skeleton_input"></div>
        <div className="skeleton_input"></div>
        <div className="skeleton_input"></div>
        <div className="skeleton_input"></div>
        <div className="skeleton_button"></div>
      </div>
    );
  }
  return (
    <div className="skeleton_login">
      <div className="skeleton_input"></div>
      <div className="skeleton_input"></div>
      <div className="skeleton_button"></div>
    </div>
  );
};

export default SkeletonAuth;

import "./SkeletonInvite.css";
const SkeletonInvite = () => {
  return (
    <div className="skeleton_invite">
      <div className="skeleton_image"></div>
      <div className="skeleton_invite_content">
        <div className="skeleton_content"></div>
        <div className="skeleton_button"></div>
      </div>
    </div>
  );
};

export default SkeletonInvite;

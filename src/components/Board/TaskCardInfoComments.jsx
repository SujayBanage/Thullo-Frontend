import "./TaskCardInfoComments.css";
import {
  useAddCommentMutation,
  useGetCommentByIdQuery,
  useDeleteCommentMutation,
} from "../../features/api/taskApi.js";
import { useState } from "react";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";
const CommentInputComponent = ({ task_id, profileImage }) => {
  const [comment, setComment] = useState("");
  const [addComment, { isLoading }] = useAddCommentMutation();

  const addCommentHandler = async () => {
    try {
      const result = await addComment({ task_id, text: comment });
      console.log(result);
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment_input_component">
      <div className="comment_input_container">
        <img src={profileImage} className="comment_input_avatar" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button className="comment_button" onClick={addCommentHandler}>
        {isLoading ? <Loader /> : "Comment"}
      </button>
    </div>
  );
};

const Comment = ({ comment_id, admin, user_id, task_id }) => {
  const { data, isLoading, isFetching } = useGetCommentByIdQuery(comment_id);

  const [deleteComment, deleteObj] = useDeleteCommentMutation();
  console.log("admin is : ", admin);
  console.log("user is : ", user_id);

  const deleteCommentHandler = async () => {
    try {
      const result = await deleteComment({
        comment_id,
        task_id,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading || isFetching || deleteObj.isLoading) {
    return <Loader />;
  }

  console.log("data is : ", data);

  return (
    <div className="comment_component">
      <div className="comment_header">
        <img
          src={data?.comment?.user?.profileImage}
          className="comment_user_avatar"
        />
        <div className="comment_user_name_and_date">
          <span className="comment_user_name">
            {data?.comment?.user?.username}
          </span>
          <span className="comment_date">
            {new Date(data?.comment?.createdAt).toDateString()}
          </span>
        </div>
        {admin === user_id ? (
          <button
            className="delete_comment_button"
            onClick={deleteCommentHandler}
          >
            Delete
          </button>
        ) : null}
      </div>
      <span>{data?.comment?.text}</span>
    </div>
  );
};

const TaskCardInfoComments = ({
  task_id,
  comments,
  admin,
  user_id,
  profileImage,
  checkIfUser,
}) => {
  return (
    <div className="task_card_info_comments_container">
      {(admin === user_id || checkIfUser(user_id)) && (
        <CommentInputComponent task_id={task_id} profileImage={profileImage} />
      )}
      <div className="task_card_info_comments_list">
        {comments?.length > 0 ? (
          comments?.map((comment) => (
            <Comment
              key={comment}
              comment_id={comment}
              admin={admin}
              user_id={user_id}
              task_id={task_id}
            />
          ))
        ) : (
          <NotFound message="No Comments Yet" />
        )}
      </div>
    </div>
  );
};

export default TaskCardInfoComments;

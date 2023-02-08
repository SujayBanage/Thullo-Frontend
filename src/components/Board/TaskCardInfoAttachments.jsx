import "./TaskCardInfoAttachments.css";
import { MdDescription } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import {
  useUploadAttachmentMutation,
  useGetAttachmentByIdQuery,
  useDeleteAttachmentMutation,
} from "../../features/api/taskApi.js";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound.jsx";
import useToast from "../../Hooks/useToast";

import { useState } from "react";

const Attachment = ({
  task_id,
  attachment_id,
  admin,
  user_id,
  checkIfUser,
}) => {
  const Toast = useToast();

  const { data, isLoading, isFetching } =
    useGetAttachmentByIdQuery(attachment_id);

  const [deleteAttachment, deleteObj] = useDeleteAttachmentMutation();

  const deleteAttachmentHandler = async () => {
    try {
      const result = await deleteAttachment({
        cloudinary_id: data?.attachment?.public_key,
        attachment_id,
        task_id,
      }).unwrap();
      Toast(result?.error, result?.message);
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
    <div className="task_attachment">
      <iframe
        scrolling="no"
        src={data?.attachment?.src}
        className="task_attachment_file"
      />

      <div className="task_attachment_info">
        <span className="task_attachment_date">
          Added {new Date(data?.attachment?.createdAt).toDateString()}
        </span>
        <span className="task_attachment_date">
          Attachment_by {data?.attachment?.user?.username}
        </span>
        <span className="task_attachment_title">{data?.attachment?.name}</span>
        <div className="task_attachment_buttons">
          <a href={data?.attachment?.src} download>
            <button>Download</button>
          </a>
          {admin === user_id ? (
            <button onClick={deleteAttachmentHandler}>Delete</button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const TaskCardInfoAttachments = ({
  task_id,
  attachments,
  admin,
  user_id,
  checkIfUser,
}) => {
  const Toast = useToast();
  const [uploadAttachment, { isLoading }] = useUploadAttachmentMutation();

  const [attachment, setAttachment] = useState("");

  const attachmentUploadHandler = () => {
    const reader = new FileReader();
    reader.readAsDataURL(attachment);
    reader.onloadend = async () => {
      try {
        const result = await uploadAttachment({
          attachment: reader.result,
          name: attachment.name,
          task_id,
        }).unwrap();
        Toast(result?.error, result?.message);
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    };
    setAttachment("");
  };

  return (
    <div className="task_card_info_attachments_container">
      <div className="task_card_info_attachments_heading">
        <MdDescription />
        <span>Attachments</span>

        {admin === user_id ||
          (checkIfUser(user_id) && (
            <label
              className="task_card_info_select_attachments_button"
              htmlFor="attachment_input"
            >
              select
              <input
                id="attachment_input"
                type="file"
                className="task_card_info_attachment_input"
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  setAttachment(e.target.files[0]);
                }}
                hidden
              />
            </label>
          ))}
        {attachment && (
          <button
            className="task_card_info_add_attachments_button"
            onClick={attachmentUploadHandler}
          >
            <IoMdAdd />
            Add {attachment.name.substring(0, 9)} ....
          </button>
        )}
      </div>
      <div
        className={
          attachments.length > 0
            ? "task_card_info_attachments_list"
            : "task_card_info_no_attachments"
        }
      >
        {isLoading && <Loader />}
        {!isLoading && attachments?.length > 0
          ? attachments?.map((attachment) => (
              <Attachment
                admin={admin}
                user_id={user_id}
                key={attachment}
                attachment_id={attachment}
                task_id={task_id}
              />
            ))
          : !isLoading && <NotFound message="No Attachments Yet" />}
      </div>
    </div>
  );
};

export default TaskCardInfoAttachments;

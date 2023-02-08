import "./AddMemberComponent.css";
import "./AddMemberComponent.css";
import { useGetBoardUsersByIdQuery } from "../../features/api/boardApi.js";
import { useAddUserMutation } from "../../features/api/taskApi.js";
import { useEffect, useState } from "react";
import NotFound from "../NotFound/NotFound.jsx";
import useToast from "../../hooks/useToast";
const AddMemberComponent = ({ task_users, task_id, board_id }) => {
  const Toast = useToast();
  const { data } = useGetBoardUsersByIdQuery(board_id);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState(data?.users);
  console.log(data);
  const [addUser] = useAddUserMutation();

  const addMemberToTask = async () => {
    setUsers(users.filter((user) => user.user_id !== userId));
    try {
      const result = await addUser({
        task_id,
        user_id: userId,
      }).unwrap();
      console.log(result);
      Toast(result?.error, result?.message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (users?.length <= 0) {
      return;
    }
    let boardUsersArr = [];
    boardUsersArr = users?.filter((user) => {
      let user_id = user.user_id;
      let bool = true;
      for (let i = 0; i < task_users.length; i++) {
        if (task_users[i].user_id === user_id) {
          bool = false;
          break;
        }
      }
      return bool === true;
    });
    setUsers(boardUsersArr);
  }, [data?.users]);

  return (
    <div className="add_member_component">
      <h3>Members</h3>
      <span>Add Members to this Card</span>
      <div className="search_members_list">
        {users?.length > 0 ? (
          users?.map((user) => {
            return (
              <div key={user?.user_id} className="search_member">
                <img src={user?.profileImage} />
                <span>{user?.username}</span>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUserId(user?.user_id);
                    } else {
                      setUserId("");
                    }
                  }}
                />
              </div>
            );
          })
        ) : (
          <NotFound message="users not found" />
        )}
      </div>
      {users?.length > 0 && (
        <button className="assign_member_button" onClick={addMemberToTask}>
          Add
        </button>
      )}
    </div>
  );
};

export default AddMemberComponent;

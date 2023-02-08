import { lazy, useState, Suspense } from "react";
import "./Board.css";
import { useParams } from "react-router-dom";
import { useGetBoardInfoQuery } from "../../features/api/boardApi.js";
import Loader from "../Loader/Loader.jsx";
import { selectGetUserInfoResults } from "../../features/api/userApi.js";
import { useSelector } from "react-redux";
// import BoardContent from "./BoardContent";
// import BoardHeader from "./BoardHeader";
// import BoardInfo from "./BoardInfo";

const BoardContent = lazy(() => import("./BoardContent.jsx"));
const BoardHeader = lazy(() => import("./BoardHeader.jsx"));
const BoardInfo = lazy(() => import("./BoardInfo.jsx"));

const Board = () => {
  const userResult = useSelector(selectGetUserInfoResults);
  const { board_id } = useParams();
  console.log("board id is : ", board_id);
  const { data, isFetching, isLoading } = useGetBoardInfoQuery(board_id);
  const [showMenu, setShowMenu] = useState(false);
  console.log("board is : ", data);

  if (isFetching || isLoading) {
    return <Loader />;
  }

  return (
    <section className="board_container">
      <Suspense fallback={<Loader />}>
        <BoardHeader
          visibility={data?.board?.visibility}
          users={data?.board?.users}
          board_id={data?.board?._id}
          admin_id={data?.board?.admin?.user_id}
          user_id={userResult?.data?.user._id}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <BoardContent
          columns={data?.board?.columns}
          board_id={data?.board?._id}
          admin_id={data?.board?.admin?.user_id}
          user_id={userResult?.data?.user._id}
        />
      </Suspense>
      {showMenu && (
        <Suspense fallback={<Loader />}>
          <BoardInfo setShowMenu={setShowMenu} board={data?.board} />
        </Suspense>
      )}
    </section>
  );
};

export default Board;

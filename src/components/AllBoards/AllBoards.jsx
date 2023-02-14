import "./AllBoards.css";
import { IoMdAdd } from "react-icons/io";
import { useGetAllBoardsQuery } from "../../features/api/boardApi.js";
import { useState, lazy, Suspense } from "react";
import SkeletonCard from "../skeletonComponents/SkeletonCard.jsx";
import Loader from "../Loader/Loader";
// import BoardCard from "../BoardCard/BoardCard";
// import Portal from "../Portal/Portal";
// import CreateBoard from "../CreateBoard/CreateBoard";
// import BoardInvites from "./BoardInvites.jsx";
const BoardCard = lazy(() => import("../BoardCard/BoardCard.jsx"));
const Portal = lazy(() => import("../Portal/Portal.jsx"));
const CreateBoard = lazy(() => import("../CreateBoard/CreateBoard.jsx"));
const BoardInvites = lazy(() => import("./BoardInvites.jsx"));

const AllBoards = () => {
  const [addBoard, setAddBoard] = useState(false);
  const { data, isLoading, isFetching } = useGetAllBoardsQuery({
    refetchOnMountOrArgChange: true,
  });
  console.log("all boards are : ", data);

  return (
    <section className="allboards_container">
      {addBoard && (
        <Suspense fallback={<Loader />}>
          <Portal>
            <CreateBoard show={addBoard} setShow={setAddBoard} />
          </Portal>
        </Suspense>
      )}
      <div className="allboards_cards_container">
        <header className="allboards_header">
          <span>AllBoards</span>
          <button
            className="boards_add_button"
            onClick={() => setAddBoard(!addBoard)}
          >
            <IoMdAdd />
            <span>Create Board</span>
          </button>
        </header>
        <div className="allboards_cards">
          {(isLoading || isFetching) &&
            Array(5)
              .fill()
              .map(() => {
                return <SkeletonCard />;
              })}
          {data?.allBoards?.map((board) => {
            return (
              <Suspense fallback={<SkeletonCard />}>
                <BoardCard key={board._id} board={board} />
              </Suspense>
            );
          })}
        </div>
      </div>
      <Suspense fallback={<Loader />}>
        <BoardInvites />
      </Suspense>
    </section>
  );
};

export default AllBoards;

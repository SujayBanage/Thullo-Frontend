import "./BoardInvites.css";
import { useGetAllInvitesQuery } from "../../features/api/boardApi.js";
// import Invite from "./Invite.jsx";
import NotFound from "../NotFound/NotFound.jsx";
import SkeletonInvite from "../skeletonComponents/SkeletonInvite";
import { lazy, Suspense } from "react";
const Invite = lazy(() => import("./Invite.jsx"));
const BoardInvites = () => {
  const { data, isLoading, isFetching } = useGetAllInvitesQuery();
  return (
    <div className="board_invites_container">
      <h3>Board Invitations</h3>
      <section className="board_invites">
        {isLoading || isFetching ? (
          Array(10)
            .fill()
            .map(() => {
              return <SkeletonInvite />;
            })
        ) : data?.allInvites?.length > 0 ? (
          data?.allInvites?.map((invite) => {
            return (
              <Suspense fallback={<SkeletonInvite />}>
                <Invite invite={invite} />;
              </Suspense>
            );
          })
        ) : (
          <NotFound message="No Invitations" />
        )}
      </section>
    </div>
  );
};
export default BoardInvites;

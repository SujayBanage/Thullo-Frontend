// import Logo from "./Logo";
// import Profile from "./Profile";
import { lazy, Suspense } from "react";
import Loader from "../Loader/Loader";
import "./Navbar.css";
const Logo = lazy(() => import("./Logo"));
const Profile = lazy(() => import("./Profile"));

const Navbar = () => {
  return (
    <nav className="navbar_container">
      <Suspense fallback={<Loader />}>
        <Logo />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Profile />
      </Suspense>
    </nav>
  );
};
export default Navbar;

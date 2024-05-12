import {Navigate, Outlet, useLocation} from "react-router-dom";
import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import Paths from "./util/Paths";

function App() {
const location = useLocation();
const { pathname } = location;
  return (
    <div className="">
        <SignedIn>
           /** Vite app signed in **/
            <UserButton />
            <Outlet />
        </SignedIn>
        <SignedOut>
            {/* Vite app signed out */}
            {
                pathname === "/" ? <Navigate to={Paths.INTRODUCTION} replace={true}/> : null
            }
            <Outlet />
        </SignedOut>
    </div>
  )
}

export default App;

import {Navigate, Outlet, useLocation} from "react-router-dom";
import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import Paths from "./util/Paths";

function App() {
const location = useLocation();
const { pathname } = location;
  return (
    <div className="bg-gradient-to-r from-bg_placeholder1 to-bg_placeholder2">
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

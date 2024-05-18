import {Navigate, Outlet, useLocation} from "react-router-dom";
import {SignedIn, SignedOut, /*UserButton*/} from "@clerk/clerk-react";
import Paths from "./util/Paths";
import {ToastContainer} from "react-toastify";

function App() {
    const location = useLocation();
    const {pathname} = location;
    return (
        <div>
            <SignedIn>
                <Outlet/>
            </SignedIn>
            <SignedOut>
                {
                    pathname === "/" ? <Navigate to={Paths.INTRODUCTION} replace={true}/> : null
                }
                <Outlet/>
            </SignedOut>
            <ToastContainer/>
        </div>
    )
}

export default App;

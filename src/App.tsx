import {Outlet} from "react-router-dom";
import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import IntroductionPage from "./components/IntroductionPage";

function App() {

  return (
    <div>
        <SignedIn>
            Vite app signed in
            <UserButton />
        </SignedIn>
        <SignedOut>
            Vite app signed out
            <Outlet />
        </SignedOut>
    </div>
  )
}

export default App;

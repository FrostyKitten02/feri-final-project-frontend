import {Outlet} from "react-router-dom";
import {UserButton} from "@clerk/clerk-react";

function App() {

  return (
    <div>
        Vite app
        <Outlet />
        <UserButton />
    </div>
  )
}

export default App;

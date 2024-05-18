import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";

function App() {
    return (
        <div>
            <Outlet/>
            <ToastContainer/>
        </div>
    )
}

export default App;

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";

function AppRouter() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [],
        },
    ]);

    return <RouterProvider router={router} />
}
export default AppRouter;
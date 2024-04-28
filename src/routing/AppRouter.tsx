import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootApp from "../RootApp";
import ErrorPage from "../components/ErrorPage";

function AppRouter() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootApp />,
            errorElement: <ErrorPage />,
            children: [],
        },
    ]);

    return <RouterProvider router={router} />
}
export default AppRouter;
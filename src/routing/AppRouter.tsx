import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import AuthorizationPage from "../components/authorization/AuthorizationPage";
import SignOutDemo from "../components/authorization/SignOutDemo";

function AppRouter() {
    const routes: RouteObject [] = [
        {
            path: "auth",
            element: <AuthorizationPage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "sign-up",
                    element: <SignUpPage />,
                },
                {
                    path: "sign-in",
                    element: <SignInPage />,
                    children: [
                        {
                            path: "factor-one",
                            element: <SignInPage />,
                        }
                    ]
                },
            ]
        }
    ]
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: routes,
        },
    ]);

    return <RouterProvider router={router} />
}
export default AppRouter;
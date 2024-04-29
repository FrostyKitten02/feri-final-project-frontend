import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import AuthorizationPage from "../components/authorization/AuthorizationPage";
import ProjectMainPage from "../components/main-1/ProjectMainPage";

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
            ],
        },
        {
            path: "projectId",
            element: <ProjectMainPage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "dashboard",
                    element: <></>
                },
                {
                    path: "team",
                    element: <></>
                },
                {
                    path: "work-packages",
                    element: <></>
                },
                {
                    path: "project",
                    element: <></>
                }
            ]
        },
        {
            path: "projects",
            element: <></>
        },
        {
            path: "profile",
            element: <></>
        },

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
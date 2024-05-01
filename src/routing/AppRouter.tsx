import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/main-1/ProjectMainPage";
import IntroductionPage from "../components/introduction/IntroductionPage";

function AppRouter() {
    const routes: RouteObject [] = [
        {
            path: "sign-up",
            element: <SignUpPage/>,
            errorElement: <ErrorPage />
        },
        {
            path: "introduction",
            element: <IntroductionPage />,
            errorElement: <ErrorPage />
        },
        {
            path: "sign-in",
            errorElement: <ErrorPage />,
            element: <SignInPage/>,
            children: [
                        {
                            path: "factor-one",
                            element: <SignInPage />,
                        }
                    ]
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
            element: <App/>,
            errorElement: <ErrorPage/>,
            children: routes,
        },
    ]);

    return <RouterProvider router={router}/>
}

export default AppRouter;
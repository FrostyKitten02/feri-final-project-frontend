import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/main-1/ProjectMainPage";
import IntroductionPage from "../components/introduction/IntroductionPage";
import ProjectsOverviewPage from "../components/main-2/AllProjectsPage";
import MyProjectsPage from "../components/allprojects/MyProjectsPage";
import AddNewProjectPage from "../components/allprojects/modal/AddNewProjectPage";
import AssignedToPage from "../components/allprojects/AssignedToPage";

function AppRouter() {
    const routes: RouteObject [] = [
        {
            path: "sign-up/*",
            element: <SignUpPage />,
            errorElement: <ErrorPage />,
        },
        {
            path: "introduction",
            element: <IntroductionPage />,
            errorElement: <ErrorPage />
        },
        {
            path: "sign-in/*",
            errorElement: <ErrorPage />,
            element: <SignInPage/>,
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
            path: "all-projects",
            element: <ProjectsOverviewPage/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "my-projects",
                    element: <MyProjectsPage />
                },
                {
                    path: "assigned-to",
                    element: <AssignedToPage/>
                },
            ]
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
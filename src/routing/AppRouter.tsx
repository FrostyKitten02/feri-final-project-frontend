import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/project-main/ProjectMainPage";
import IntroductionPage from "../components/introduction/IntroductionPage";
import ProjectsOverviewPage from "../components/app-main/projects/AllProjectsPage";
import AppMainPage from "../components/app-main/AppMainPage";
import AssignedToPage from "../components/app-main/projects/AssignedToPage";
import DashboardPage from "../components/project-main/DashboardPage";
import TeamPage from "../components/project-main/TeamPage";
import MyProjectsPage from "../components/app-main/projects/MyProjectsPage";
import WorkPackagePage from "../components/project-main/work-package/WorkpackagePage";
import {useSession} from "@clerk/clerk-react";
import Paths from "../util/Paths";


function AppRouter() {
    const { isSignedIn } = useSession();

    const signedOutRoutes: RouteObject [] = [
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
    ]

    const signedInRoutes: RouteObject [] = [
        {
            path: ":projectId",
            element: <ProjectMainPage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "dashboard",
                    element: <DashboardPage />,
                    errorElement: <ErrorPage />
                },
                {
                    path: "team",
                    element: <TeamPage />,
                    errorElement: <ErrorPage />
                },
                {
                    path: "work-packages",
                    element: <WorkPackagePage />,
                    errorElement: <ErrorPage />
                },
                {
                    path: "project",
                    element: <></>,
                    errorElement: <ErrorPage />
                }
            ]
        },
        {
            path: "/",
            element: <AppMainPage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "projects",
                    element: <ProjectsOverviewPage/>,
                    errorElement: <ErrorPage/>,
                    children: [
                        {
                            path: "my-projects",
                            element: <MyProjectsPage />,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "assigned-to",
                            element: <AssignedToPage/>,
                            errorElement: <ErrorPage/>
                        },
                    ]
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
            errorElement: isSignedIn ? <ErrorPage /> : <Navigate to={Paths.INTRODUCTION} replace={true}/>,
            children: isSignedIn ? signedInRoutes : signedOutRoutes,
        },
    ]);

    return <RouterProvider router={router}/>
}

export default AppRouter;
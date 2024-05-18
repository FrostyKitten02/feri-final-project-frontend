import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/main-1/ProjectMainPage";
import IntroductionPage from "../components/introduction/IntroductionPage";
import ProjectsOverviewPage from "../components/main-2/pages/allprojects/AllProjectsPage";
import MyProjectsPage from "../components/main-2/pages/allprojects/MyProjectsPage";
import AssignedToPage from "../components/main-2/pages/allprojects/AssignedToPage";
import TeamPage from "../components/main-1/pages/TeamPage";
import DashboardPage from "../components/main-1/pages/DashboardPage";
import AppMainPage from "../components/main-2/AppMainPage";
import WorkPackagePage from "../components/main-1/pages/work-package/WorkpackagePage";

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
            path: "project-details/:projectId",
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
            path: "home-page",
            element: <AppMainPage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "all-projects",
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
            errorElement: <ErrorPage/>,
            children: routes,
        },
    ]);

    return <RouterProvider router={router}/>
}

export default AppRouter;
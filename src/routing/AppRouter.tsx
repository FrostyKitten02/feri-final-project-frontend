import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/template/pages/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/project-main/ProjectMainPage";
import IntroductionPage from "../components/introduction/IntroductionPage";
import AppMainPage from "../components/app-main/AppMainPage";
import MyProjectsPage from "../components/app-main/projects/MyProjectsPage";
import WorkPackagePage from "../components/project-main/work-package/WorkpackagePage";
import {useSession} from "@clerk/clerk-react";
import Paths from "../util/Paths";
import AccountSettingsPage from "../components/account-settings/AccountSettingsPage";
import InProgressPage from "../components/template/pages/InProgressPage";
import {MainDashboardPage} from "../components/app-main/MainDashboardPage";
import {ProjectDashboardPage} from "../components/project-main/ProjectDashboardPage";
import ValidateProjectId from "../components/ValidateProjectId";
import {RedirectMain} from "../components/app-main/RedirectMain";
import ProjectTeamPage from "../components/project-main/team/ProjectTeamPage";

function AppRouter() {

    const {isLoaded, isSignedIn} = useSession();

    if (!isLoaded) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    const signedOutRoutes: RouteObject [] = [
        {
            path: "sign-up/*",
            element: <SignUpPage/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "introduction",
            element: <IntroductionPage/>,
            errorElement: <ErrorPage/>
        },
        {
            path: "sign-in/*",
            element: <SignInPage/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "",
            element: <Navigate to={Paths.INTRODUCTION}/>,
            errorElement: <ErrorPage/>
        },
    ]

    const signedInRoutes: RouteObject [] = [
        {
            path: "project/:projectId",
            element: <ValidateProjectId/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "",
                    element: <ProjectMainPage/>,
                    errorElement: <ErrorPage/>,
                    children: [
                        {
                            path: "project-dashboard",
                            element: <ProjectDashboardPage/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "team",
                            element: <ProjectTeamPage/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "work-packages",
                            element: <WorkPackagePage/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "project-overview",
                            element: <InProgressPage/>,
                            errorElement: <ErrorPage/>
                        },
                        //this is shown initially
                        {
                            path: "",
                            element: <Navigate to={"dashboard"}/>,
                            errorElement: <ErrorPage/>
                        },
                    ]
                }
            ]
        },
        {
            path: "account-settings",
            element: <AccountSettingsPage/>,
            errorElement: <ErrorPage/>
        },
        {
            path: "/",
            element: <AppMainPage/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "projects",
                    element: <MyProjectsPage/>,
                    errorElement: <ErrorPage/>,
                },
                {
                    path: "",
                    element: <RedirectMain />,
                    errorElement: <ErrorPage/>
                },
                {
                    path: "dashboard",
                    element: <MainDashboardPage/>,
                    errorElement: <ErrorPage/>
                },
            ]
        },
    ]

    const router = createBrowserRouter([
        {
            path: "/",
            element: <App/>,
            errorElement: isSignedIn ? <ErrorPage/> : <Navigate to={Paths.INTRODUCTION} replace={true}/>,
            children: isSignedIn ? signedInRoutes : signedOutRoutes,
        },
    ]);

    return <RouterProvider router={router}/>
}

export default AppRouter;
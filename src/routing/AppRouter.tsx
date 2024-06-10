import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/project-main/ProjectMainPage";
import IntroductionPage from "../components/introduction/IntroductionPage";
import AppMainPage from "../components/app-main/AppMainPage";
import TeamPage from "../components/project-main/TeamPage";
import MyProjectsPage from "../components/app-main/projects/MyProjectsPage";
import WorkPackagePage from "../components/project-main/work-package/WorkpackagePage";
import {useSession} from "@clerk/clerk-react";
import Paths from "../util/Paths";
import AccountSettingsPage from "../components/account-settings/AccountSettingsPage";
import InProgressPage from "../components/template/InProgressPage";
import {MainDashboardPage} from "../components/app-main/MainDashboardPage";
import {ProjectDashboardPage} from "../components/project-main/ProjectDashboardPage";

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
            path: "account-settings",
            element: <AccountSettingsPage/>,
            errorElement: <ErrorPage/>
        },
        {
            //TODO če vpiše id, ki v bazi ne obstaja, ga mora navigirat na / - trenutno lahko vpiše karkoli
            path: ":projectId",
            element: <ProjectMainPage/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "dashboard",
                    element: <ProjectDashboardPage />,
                    errorElement: <ErrorPage/>
                },
                {
                    path: "team",
                    element: <TeamPage/>,
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
                    element: <InProgressPage/>,
                    errorElement: <ErrorPage/>
                },
            ]
        },
        {
            path: "/",
            element: <AppMainPage/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "projects",
                    element: <MyProjectsPage />,
                    errorElement: <ErrorPage/>,
                },
                //this is shown initially
                {
                    path: "",
                    element: <InProgressPage/>,
                    errorElement: <ErrorPage/>
                },
                {
                    path: "dashboard",
                    element: <MainDashboardPage />,
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
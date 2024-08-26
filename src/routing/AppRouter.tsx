import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/template/pages/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import ProjectMainPage from "../components/project-main/ProjectMainPage";
import {useSession} from "@clerk/clerk-react";
import Paths from "../util/Paths";
import ValidateProjectId from "../components/ValidateProjectId";
import {RedirectMain} from "../components/app-main/RedirectMain";
import ProjectTeamPage from "../components/project-main/team/ProjectTeamPage";
import {WorkPackageListing} from "../components/project-main/work-package/WorkPackageListing";
import {MyProjectsPage} from "../components/app-main/projects/MyProjectsPage";
import {WorkloadPage} from "../components/project-main/workload/WorkloadPage";
import {AppMainPage} from "../components/app-main/AppMainPage";
import {DashboardPage} from "../components/app-main/dashboard/DashboardPage";
import {OverviewChartPage} from "../components/project-main/overview-chart/OverviewChartPage";
import ProjectDashboardPage from "../components/project-main/project-dashboard/ProjectDashboardPage";
import LandingPage from "../components/landing-page/LandingPage";
import {FileManagerPage} from "../components/project-main/file-manager/FileManagerPage";
import {ReportPage} from "../components/project-main/report/ReportPage";

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
            element: <LandingPage/>,
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
                            element: <WorkPackageListing/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "overview",
                            element: <OverviewChartPage/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "",
                            element: <Navigate to={Paths.DASHBOARD}/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "workload",
                            element: <WorkloadPage/>,
                            errorElement: <ErrorPage/>
                        },
                        {
                            path: "file-manager",
                            element: <FileManagerPage/>,
                            errorElement: <ErrorPage/>
                        }, {
                            path: "report",
                            element: <ReportPage/>,
                            errorElement: <ErrorPage/>
                        },
                    ]
                }
            ]
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
                    path: "dashboard",
                    element: <DashboardPage/>,
                    errorElement: <ErrorPage/>
                },
                {
                    path: "",
                    element: <RedirectMain/>,
                    errorElement: <ErrorPage/>
                }
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
import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
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

function AppRouter() {

    const routes: RouteObject [] = [
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
            //TODO če vpiše id, ki v bazi ne obstaja, ga mora navigirat na / - trenutno lahko vpiše karkoli
            path: ":projectId",
            element: <ProjectMainPage/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "dashboard",
                    element: <DashboardPage/>,
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
                    path: "project",
                    element: <></>,
                    errorElement: <ErrorPage/>
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
                    element: <ProjectsOverviewPage/>,
                    errorElement: <ErrorPage/>,
                    children: [
                        {
                            path: "my-projects",
                            element: <MyProjectsPage/>,
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
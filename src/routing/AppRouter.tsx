import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import SignInPage from "../components/authorization/SignInPage";
import SignUpPage from "../components/authorization/SignUpPage";
import IntroductionPage from "../components/IntroductionPage";

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
                    element: <SignInPage/>,
                }
            ]
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
import { Outlet } from "react-router-dom";

function ProjectsOverviewPage ()  {
    return (
        <div className="flex flex-col h-screen">
            <h1>Projects Overview</h1>
            <Outlet />
        </div>
    );
}
export default ProjectsOverviewPage;
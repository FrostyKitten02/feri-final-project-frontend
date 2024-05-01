import SidebarTemplate from "../layout/SidebarTemplate";
import {Outlet} from "react-router-dom";

function ProjectMainPage() {
    return (
        <div className="bg-blue-50 flex flex-row h-screen">
            <SidebarTemplate />
            <Outlet />
        </div>
    )
}

export default ProjectMainPage;
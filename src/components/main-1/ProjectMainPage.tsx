import { useEffect } from "react";
import SidebarTemplate from "../layout/SidebarTemplate";
import {Outlet} from "react-router-dom";
import { useParams } from "react-router-dom";

function ProjectMainPage() {

    const { projectId } = useParams();

    return (
        <div className="bg-blue-50 flex flex-row h-screen">
            <SidebarTemplate projectId={projectId} />
            <Outlet />
        </div>
    )
}

export default ProjectMainPage;
import SidebarTemplate from "../layout/SidebarTemplate";
import {Outlet} from "react-router-dom";
import {ListItem} from "../../interfaces";
import dashboardIconPath from "../../pictures/icons/dashboard-icon.svg";
import boxOpenIconPath from "../../pictures/icons/box-open-icon.svg"
import folderIconPath from "../../pictures/icons/folder-icon.svg"
import usersIconPath from "../../pictures/icons/users-icon.svg"

function ProjectMainPage() {
    const items: ListItem [] = [
        {
            name: "DASHBOARD",
            linkPath: "/projectId/dashboard",
            iconPath: dashboardIconPath,
            alt: "Dashboard Icon"
        },
        {
            name: "TEAM",
            linkPath: "/projectId/team",
            iconPath: usersIconPath,
            alt: "Users Icon"
        },
        {
            name: "WORK PACKAGES",
            linkPath: "/projectId/project",
            iconPath: boxOpenIconPath,
            alt: "Box Open Icon"
        },
        {
            name: "PROJECT",
            linkPath: "/projectId/project",
            iconPath: folderIconPath,
            alt: "Folder Icon"
        }
    ]

    return (
        <div className="h-[3000px]flex flex-row h-screen">
            <SidebarTemplate items={items}/>
            <Outlet/>
        </div>
    )
}

export default ProjectMainPage;
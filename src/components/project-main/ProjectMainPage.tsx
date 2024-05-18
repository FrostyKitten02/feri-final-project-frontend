import SidebarTemplate from "../template/SidebarTemplate";
import {Outlet} from "react-router-dom";
import {ListItem} from "../../interfaces";
import dashboardIconPath from "../../assets/icons/dashboard-icon.svg";
import boxOpenIconPath from "../../assets/icons/box-open-icon.svg"
import folderIconPath from "../../assets/icons/folder-icon.svg"
import usersIconPath from "../../assets/icons/users-icon.svg"

function ProjectMainPage() {
    const items: ListItem [] = [
        {
            name: "DASHBOARD",
            linkPath: "dashboard",
            iconPath: dashboardIconPath,
            alt: "Dashboard Icon"
        },
        {
            name: "TEAM",
            linkPath: "team",
            iconPath: usersIconPath,
            alt: "Users Icon"
        },
        {
            name: "WORK PACKAGES",
            linkPath: "work-packages",
            iconPath: boxOpenIconPath,
            alt: "Box Open Icon"
        },
        {
            name: "PROJECT",
            linkPath: "project",
            iconPath: folderIconPath,
            alt: "Folder Icon"
        }
    ]

    return (
        <div className="flex flex-row h-screen bg-[#B2CDD5]">
            <SidebarTemplate items={items}/>
            <div className="bg-white my-5 mr-5 w-full rounded-[20px]">
                <Outlet/>
            </div>
        </div>
    )
}

export default ProjectMainPage;
import SidebarTemplate from "../template/SidebarTemplate";
import {Outlet} from "react-router-dom";
import {ListItem} from "../../interfaces";
import DashboardIcon from "../../assets/icons/dashboard-icon.svg?react";
import BoxOpenIcon from "../../assets/icons/box-open-icon.svg?react";
import FolderIcon from "../../assets/icons/folder-icon.svg?react";
import UsersIcon from "../../assets/icons/users-icon.svg?react";

function ProjectMainPage() {
    const items: ListItem [] = [
        {
            name: "DASHBOARD",
            linkPath: "dashboard",
            iconComponent: DashboardIcon,
        },
        {
            name: "TEAM",
            linkPath: "team",
            iconComponent: UsersIcon,
        },
        {
            name: "WORK PACKAGES",
            linkPath: "work-packages",
            iconComponent: BoxOpenIcon,
        },
        {
            name: "PROJECT",
            linkPath: "project",
            iconComponent: FolderIcon,
        }
    ]

    return (
        <div className="flex flex-row h-screen bg-[#1A426B]">
            <SidebarTemplate items={items} showReturn={true} />
            <div className="bg-white my-5 mr-5 w-full rounded-[20px]">
                <Outlet/>
            </div>
        </div>
    )
}

export default ProjectMainPage;
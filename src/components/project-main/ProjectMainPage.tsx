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
            name: "PROJECT OVERVIEW",
            linkPath: "project-overview",
            iconComponent: FolderIcon,
        },
        {
            name: "WORK PACKAGES",
            linkPath: "work-packages",
            iconComponent: BoxOpenIcon,
        },
        {
            name: "TEAM",
            linkPath: "team",
            iconComponent: UsersIcon,
        },
    ]

    return (
        <div className="flex flex-row h-screen bg-primary">
            <SidebarTemplate items={items} showReturn={true}/>
            <div className="flex w-[82%] flex-grow my-5 mr-5">
                <div className="flex bg-white flex-grow rounded-[20px]">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default ProjectMainPage;
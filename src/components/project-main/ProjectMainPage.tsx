import SidebarTemplate from "../template/SidebarTemplate";
import {Outlet, useParams} from "react-router-dom";
import {ListItem} from "../../interfaces";
//import { LuLayoutDashboard } from "react-icons/lu";
//import { IoPeopleOutline } from "react-icons/io5";
//import { LuPackage } from "react-icons/lu";
import BoxOpenIcon from "../../assets/icons/box-open-icon.svg?react";
import FolderIcon from "../../assets/icons/folder-icon.svg?react";
import UsersIcon from "../../assets/icons/users-icon.svg?react";
import Paths from "../../util/Paths";
import TextUtil from "../../util/TextUtil";

function ProjectMainPage() {
    const {projectId} = useParams();
    const items: Array<ListItem> = [
        {
            name: "project dashboard",
            linkPath: TextUtil.constructValidRoutePath(Paths.PROJECT_DASHBOARD, ":projectId", projectId ?? ""),
        },
        {
            name: "project overview",
            linkPath: TextUtil.constructValidRoutePath(Paths.PROJECT_OVERVIEW, ":projectId", projectId ?? ""),
            iconComponent: FolderIcon,
        },
        {
            name: "work packages & tasks",
            linkPath: TextUtil.constructValidRoutePath(Paths.WORK_PACKAGES, ":projectId", projectId ?? ""),
            iconComponent: BoxOpenIcon,
        },
        {
            name: "team",
            linkPath: TextUtil.constructValidRoutePath(Paths.TEAM, ":projectId", projectId ?? ""),
            iconComponent: UsersIcon,
        },
        {
            name: "workload",
            linkPath: TextUtil.constructValidRoutePath(Paths.WORKLOAD, ":projectId", projectId ?? ""),
            iconComponent: UsersIcon
        }
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
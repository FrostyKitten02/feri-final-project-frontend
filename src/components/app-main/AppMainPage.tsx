import {Outlet} from "react-router-dom";
import SidebarTemplate from "../template/SidebarTemplate";
import DashboardIcon from "../../assets/icons/dashboard-icon.svg?react";
import {ListItem} from "../../interfaces";
import FolderIcon from "../../assets/icons/folder-icon.svg?react";
import Paths from "../../util/Paths";
export const AppMainPage = () => {
    const items: Array<ListItem> = [
        {
            name: "dashboard",
            linkPath: Paths.DASHBOARD,
            iconComponent: DashboardIcon
        },
        {
            name: "all projects",
            linkPath: Paths.PROJECTS,
            iconComponent: FolderIcon
        },
    ]
    return (
        <div className="flex flex-row h-screen bg-primary">
            <SidebarTemplate items={items} showReturn={false}/>
            <div className="flex w-[82%] flex-grow my-5 mr-5">
                <div className="flex bg-white flex-grow rounded-[20px]">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
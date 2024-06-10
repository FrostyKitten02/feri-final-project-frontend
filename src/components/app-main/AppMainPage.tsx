import {Outlet} from "react-router-dom";
import SidebarTemplate from "../template/SidebarTemplate";
import DashboardIcon from "../../assets/icons/dashboard-icon.svg?react";
import {ListItem} from "../../interfaces";
import FolderIcon from "../../assets/icons/folder-icon.svg?react";


const items: ListItem [] = [
    {
        name: "DASHBOARD",
        linkPath: "/dashboard",
        iconComponent: DashboardIcon
    },
    {
        name: "ALL PROJECTS",
        linkPath: "projects",
        iconComponent: FolderIcon
    },
]
export default function AppMainPage() {

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
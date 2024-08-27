import {Outlet} from "react-router-dom";
import SidebarTemplate from "../template/SidebarTemplate";
import { LuLayoutDashboard } from "react-icons/lu";
import {ListItem} from "../../interfaces";
import { IoFolderOutline } from "react-icons/io5";
import Paths from "../../util/Paths";
export const AppMainPage = () => {
    const items: Array<ListItem> = [
        {
            name: "dashboard",
            linkPath: Paths.DASHBOARD,
            iconComponent:(props) => <LuLayoutDashboard {...props}/>
        },
        {
            name: "all projects",
            linkPath: Paths.PROJECTS,
            iconComponent: (props) => <IoFolderOutline {...props}/>
        },
    ]
    return (
        <div className="flex flex-row h-screen bg-gradient-to-tr from-c-sky to-primary">
            <SidebarTemplate items={items} showReturn={false}/>
            <div className="flex w-[82%] flex-grow my-5 mr-5">
                <div className="flex bg-white flex-grow rounded-[20px]">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
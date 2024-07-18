import SidebarTemplate from "../template/SidebarTemplate";
import {Outlet, useParams} from "react-router-dom";
import {ListItem} from "../../interfaces";
//import { IoPeopleOutline } from "react-icons/io5";
//import { LuPackage } from "react-icons/lu";
import Paths from "../../util/Paths";
import TextUtil from "../../util/TextUtil";
import {LuLayoutDashboard, LuPackageOpen} from "react-icons/lu";
import {FaChartBar} from "react-icons/fa6";
import {IoPeopleOutline} from "react-icons/io5";
import {MdOutlineWorkOutline} from "react-icons/md";

function ProjectMainPage() {
    const {projectId} = useParams();
    const items: Array<ListItem> = [
        {
            name: "project dashboard",
            linkPath: TextUtil.constructValidRoutePath(Paths.PROJECT_DASHBOARD, ":projectId", projectId ?? ""),
            iconComponent: (props) => <LuLayoutDashboard {...props}/>
        },
        {
            name: "overview chart",
            linkPath: TextUtil.constructValidRoutePath(Paths.PROJECT_OVERVIEW, ":projectId", projectId ?? ""),
            iconComponent: (props) => <FaChartBar {...props}/>,
        },
        {
            name: "work packages & tasks",
            linkPath: TextUtil.constructValidRoutePath(Paths.WORK_PACKAGES, ":projectId", projectId ?? ""),
            iconComponent: (props) => <LuPackageOpen {...props}/>,
        },
        {
            name: "team",
            linkPath: TextUtil.constructValidRoutePath(Paths.TEAM, ":projectId", projectId ?? ""),
            iconComponent: (props) => <IoPeopleOutline {...props}/>,
        },
        {
            name: "workload",
            linkPath: TextUtil.constructValidRoutePath(Paths.WORKLOAD, ":projectId", projectId ?? ""),
            iconComponent: (props) => <MdOutlineWorkOutline {...props}/>
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
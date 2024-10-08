import SidebarTemplate from "../template/SidebarTemplate";
import {Outlet, useParams} from "react-router-dom";
import {ListItem} from "../../interfaces";
import Paths from "../../util/Paths";
import TextUtil from "../../util/TextUtil";
import {LuLayoutDashboard, LuPackageOpen} from "react-icons/lu";
import {FaChartBar} from "react-icons/fa6";
import {IoPeopleOutline} from "react-icons/io5";
import {MdOutlineWorkOutline} from "react-icons/md";
import {FaRegFolderOpen} from "react-icons/fa6";
import {TbReportAnalytics} from "react-icons/tb";

function ProjectMainPage() {
    const {projectId} = useParams();
    const items: Array<ListItem> = [
        {
            name: "dashboard",
            linkPath: TextUtil.constructValidRoutePath(Paths.PROJECT_DASHBOARD, ":projectId", projectId ?? ""),
            iconComponent: (props) => <LuLayoutDashboard {...props}/>
        },
        {
            name: "overview chart",
            linkPath: TextUtil.constructValidRoutePath(Paths.PROJECT_OVERVIEW, ":projectId", projectId ?? ""),
            iconComponent: (props) => <FaChartBar {...props}/>,
        },
        {
            name: "workload",
            linkPath: TextUtil.constructValidRoutePath(Paths.WORKLOAD, ":projectId", projectId ?? ""),
            iconComponent: (props) => <MdOutlineWorkOutline {...props}/>
        },
        {
            name: "work packages",
            linkPath: TextUtil.constructValidRoutePath(Paths.WORK_PACKAGES, ":projectId", projectId ?? ""),
            iconComponent: (props) => <LuPackageOpen {...props}/>,
        },
        {
            name: "team",
            linkPath: TextUtil.constructValidRoutePath(Paths.TEAM, ":projectId", projectId ?? ""),
            iconComponent: (props) => <IoPeopleOutline {...props}/>,
        },
        {
            name: "file manager",
            linkPath: TextUtil.constructValidRoutePath(Paths.FILE_MANAGER, ":projectId", projectId ?? ""),
            iconComponent: (props) => <FaRegFolderOpen {...props} />
        },
        {
            name: "report",
            linkPath: TextUtil.constructValidRoutePath(Paths.REPORT, ":projectId", projectId ?? ""),
            iconComponent: (props) => <TbReportAnalytics {...props} />
        }
    ]

    return (
        <div className="flex flex-row min-h-screen min-[1800px]:h-screen bg-gradient-to-tr from-primary to-c-sky">
            <SidebarTemplate items={items} showReturn={true}/>
            <div className="flex w-[82%] flex-grow py-5 pr-5">
                <div className="flex bg-white flex-grow rounded-[20px]">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default ProjectMainPage;
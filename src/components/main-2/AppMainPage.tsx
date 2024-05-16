import { Outlet } from "react-router-dom";
import SidebarTemplate from "../layout/SidebarTemplate";

const items = [
    {
        name: "ALL PROJECTS",
        linkPath: "all-projects",
    },
]

export default function AppMainPage() {
    return (
        <div className="flex flex-row h-screen bg-[#B2CDD5]">
            <SidebarTemplate items={items}/>
            <div className="bg-white my-5 mr-5 w-full rounded-[20px]">
                <Outlet/>
            </div>
        </div>
    )
}
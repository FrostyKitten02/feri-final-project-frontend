import {Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {FC, useState} from "react";
import {CustomTabProps} from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";

function AllProjects() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<string>("my-projects");
    const chooseTab = (title: string): void => {
        navigate(title);
        setSelectedTab(title);
    };

    const allTabs: string [] = [
        "my projects",
        "assigned to"
    ]
    //todo move modal for adding a new project here

    return (
        <div className="flex flex-col flex-grow px-10 py-16">
            <div className="flex flex-row">
                {allTabs.map(title => {
                    return (
                        <CustomTab key={title} tabLink={chooseTab} selectedTab={selectedTab} title={title}/>
                    )
                })}
                <div className="flex flex-row justify-end items-center flex-grow border-b-2 border-gray-200 border-solid"/>
            </div>
            <Outlet/>
        </div>
    );
}

const CustomTab: FC<CustomTabProps> = ({tabLink, selectedTab, title}) => {
    const selectTab = (): void => {
        tabLink(TextUtil.replaceSpaces(title));
    }
    return (
        <button
            onClick={selectTab}
            className={`flex border-gray-200 hover:text-secondary border-solid items-center justfiy-center text-lg font-semibold rounded-t-lg px-6 py-2 uppercase 
                ${selectedTab === TextUtil.replaceSpaces(title) ? "text-secondary border-x-2 border-t-2" : "text-gray-700 border-b-2"
            }`}
        >
            {title}
        </button>
    )
}
export default AllProjects;

import {useState} from "react";
import {Link} from "react-router-dom";
import {UserButton} from "@clerk/clerk-react";

function SidebarTemplate() {
    const [selected, setSelected] = useState<string>(null);
    const handleSelect = (name: string): void => {
        setSelected(name)
    }

    return (
        <div className="relevant bg-red-200 w-[250px] m-5 rounded-[20px]">
            <div className="h-full py-4 flex flex-col flex-wrap">
                <div className="px-6 w-full bg-green-50 h-16">
                    header
                </div>
                <div className="pl-6 w-full bg-purple-200 flex-grow">
                    <SidebarItem name="DASHBOARD"
                                 handleSelect={handleSelect}
                                 selected={selected}
                                 linkPath={"/projectid/dashboard"}/>
                    <SidebarItem name="PROJECT" handleSelect={handleSelect} selected={selected} linkPath={"/projectid/project"}/>
                    <SidebarItem name="WORK PACKAGES" handleSelect={handleSelect} selected={selected} linkPath={"/projectid/work-packages"}/>
                    <SidebarItem name="TEAM" handleSelect={handleSelect} selected={selected} linkPath={"/projectid/team"}/>
                </div>
                <div className="flex flex-row px-6 w-full h-16">
                    <div className="bg-yellow-50 flex items-center justify-center px-2">
                        <UserButton />
                    </div>
                    <div className="bg-gray-50 flex flex-col items-center justify-center w-full px-2">
                        <p>
                            Ime Priimek
                        </p>
                        <p>
                            E-mail
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SidebarItem({
                                name,
                                handleSelect,
                                selected,
                                linkPath
                            }: { name: string, handleSelect: (name: string) => void, selected: string, linkPath: string }) {
    const select = () => {
        handleSelect(name);
    }
    return (
        <Link onClick={select} to={linkPath}>
            <div
                className={selected === name ? "px-3 tracking-wider bg-blue-50 py-4 rounded-l-full" : "px-3 tracking-wider bg-transparent py-4 hover:bg-blue-50 hover:rounded-l-full"}>
                {name}
            </div>
        </Link>

    )
}

export default SidebarTemplate;
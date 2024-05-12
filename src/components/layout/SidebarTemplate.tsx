import {useState} from "react";
import {Link} from "react-router-dom";
import {UserButton} from "@clerk/clerk-react";
import * as React from "react";
import {SidebarItemProps, SidebarTemplateProps} from "../../interfaces";
import notesIconPath from "../../pictures/icons/notes-icon.svg"


const SidebarTemplate: React.FC<SidebarTemplateProps> = ({items}) => {
    const [selected, setSelected] = useState<string>('');
    const handleSelect = (name: string): void => {
        setSelected(name);
    }

    return (
        <div className="h-screen flex items-center min-w-[320px] w-[17%] flex flex-col flex-wrap bg-[#B2CDD5]">
            <div className="w-full h-24 flex flex-row justify-center items-center">
                <img className="h-14" src={notesIconPath} alt="Notes Icon"/>
                <div className="text-xl text-center">
                    PROJECT MANAGER
                </div>
            </div>
            <div className="pl-6 w-full flex-grow">
                {
                    items.map(item => {
                        return (
                            <SidebarItem key={item.name} item={item} handleSelect={handleSelect}
                                         selected={selected}/>
                        )
                    })
                }
            </div>
            <div className="flex flex-row justify-center px-6 w-full h-16 rounded-b-[20px]">
                <div className="flex px-3 items-center justify-center ">
                    <UserButton/>
                </div>
                <div className="flex px-3 flex-col items-center justify-center">
                    <p>
                        Ime Priimek
                    </p>
                </div>
            </div>
        </div>
    )
}

const SidebarItem: React.FC<SidebarItemProps> = ({item, handleSelect, selected}) => {
    const select = (): void => {
        handleSelect(item.name);
    }

    return (
        <Link onClick={select} to={item.linkPath}>
            <div
                className={selected === item.name ? "flex flex-row items-center tracking-wider bg-white py-3 rounded-l-full" : "flex flex-row items-center tracking-wider bg-transparent py-3 hover:bg-white hover:rounded-l-full"}>
                <img className="h-9 pl-3" src={item.iconPath} alt={item.alt}/>
                <div className="w-full pl-3 text-xl">
                    {item.name}
                </div>
            </div>
        </Link>
    )
}

export default SidebarTemplate;
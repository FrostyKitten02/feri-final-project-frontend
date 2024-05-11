import {useState} from "react";
import {Link} from "react-router-dom";
import {UserButton} from "@clerk/clerk-react";
import * as React from "react";
import {ListItem, SidebarItemProps, SidebarTemplateProps} from "../../interfaces";
import notesIconPath from "../../pictures/icons/notes-icon.svg"


const SidebarTemplate: React.FC<SidebarTemplateProps> = ({items}) => {
    const [selected, setSelected] = useState<string>(null);
    const handleSelect = (name: string): void => {
        setSelected(name);
    }

    return (
        <div className="h-screen py-8 flex items-center min-w-[320px] w-[17%]">
            <div className="h-full relevant bg-red-200 w-full m-5 rounded-[20px]">
                <div className="h-full py-4 flex flex-col flex-wrap">
                    <div className="w-full bg-green-50 h-24 flex flex-row justify-center items-center">
                        <img className="h-14" src={notesIconPath} alt="Notes Icon"/>
                        <div className="text-xl text-center">
                            PROJECT MANAGER
                        </div>
                    </div>
                    <div className="pl-6 w-full bg-purple-200 flex-grow">
                        {
                            items.map(item => {
                                return (
                                    <SidebarItem key={item.name} item={item} handleSelect={handleSelect}
                                                 selected={selected}/>
                                )
                            })
                        }
                    </div>
                    <div className="flex flex-row px-6 w-full h-16">
                        <div className="bg-yellow-50 flex items-center justify-center px-2">
                            <UserButton/>
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
        </div>
    )
}

export function SidebarItem({item, handleSelect, selected}: SidebarItemProps): React.ReactElement {
    const select = () => {
        handleSelect(item.name);
    }

    return (
        <Link onClick={select} to={item.linkPath}>
            <div
                className={selected === item.name ? "flex flex-row items-center tracking-wider bg-white py-3 rounded-l-full" : "flex flex-row items-center tracking-wider bg-transparent py-3 hover:bg-white hover:rounded-l-full"}>
                <img className="h-10 pl-3" src={item.iconPath} alt={item.alt}/>
                <div className="w-full pl-3 text-xl">
                    {item.name}
                </div>
            </div>
        </Link>

    )
}

export default SidebarTemplate;
import * as React from "react";
import {useState} from "react";
import {Link} from "react-router-dom";
import {UserButton} from "@clerk/clerk-react";
import {SidebarItemProps, SidebarTemplateProps} from "../../interfaces";
import hamburgerIconPath from "../../assets/icons/hamburger-icon.svg";
import {motion} from "framer-motion";


const SidebarTemplate: React.FC<SidebarTemplateProps> = ({items}) => {
    const [selected, setSelected] = useState<string>('');
    const [opened, setOpened] = useState<boolean>(true);

    const toggle = () => setOpened(!opened);
    const handleSelect = (name: string): void => setSelected(name);

    return (
        <motion.div animate={{width: opened ? "20%" : "6%"}}
                    initial={{width: "20%"}}
                    transition={{duration: 0.4}}
                    className="h-full flex items-center flex-col flex-wrap bg-[#B2CDD5]">
            <div
                className={opened ? `w-full py-5 pr-3 flex flex-row items-center justify-end` : `w-full py-5 flex flex-row items-center justify-center`}>
                {
                    opened &&
                    <div className="text-xl text-center w-full">
                        PROJECT MANAGER
                    </div>
                }
                <button onClick={toggle}>
                    <img className="h-14" src={hamburgerIconPath}/>
                </button>
            </div>
            <div className="pl-6 w-full flex-grow">
                {
                    items.map(item => {
                        return (
                            <SidebarItem key={item.name} item={item} handleSelect={handleSelect}
                                         selected={selected} opened={opened}/>
                        )
                    })
                }
            </div>
            <div className="flex flex-row justify-center px-6 w-full h-16 rounded-b-[20px]">
                <div className="flex px-3 items-center justify-center ">
                    <UserButton/>
                </div>
                {
                    opened &&
                    <div className="flex px-3 flex-col items-center justify-center">
                        <p>
                            Ime Priimek
                        </p>
                    </div>
                }
            </div>
        </motion.div>
    )
}

const SidebarItem: React.FC<SidebarItemProps> = ({item, handleSelect, selected, opened}) => {
    const select = (): void => {
        handleSelect(item.name);
    }

    return (
        <Link onClick={select} to={item.linkPath}>
            <div
                className={selected === item.name ? "flex flex-row items-center tracking-wider bg-white py-3 rounded-l-full" : "flex flex-row items-center tracking-wider bg-transparent py-3 hover:bg-white hover:rounded-l-full"}>
                <img className="h-10 pl-3" src={item.iconPath} alt={item.alt}/>
                {
                    opened &&
                    <div className="w-full pl-3 text-xl">
                        {item.name}
                    </div>
                }
            </div>
        </Link>
    )
}

export default SidebarTemplate;
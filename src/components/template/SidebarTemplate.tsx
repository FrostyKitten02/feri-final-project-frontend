import * as React from "react";
import {useState} from "react";
import {Link} from "react-router-dom";
import {UserButton} from "@clerk/clerk-react";
import {SidebarItemProps, SidebarTemplateProps} from "../../interfaces";
import HamburgerIcon from "../../assets/icons/hamburger-icon.svg?react";
import ReturnIcon from "../../assets/icons/return.svg?react";
import {motion} from "framer-motion";
import Paths from "../../util/Paths";

const SidebarTemplate: React.FC<SidebarTemplateProps> = ({items, showReturn}) => {
    const [selected, setSelected] = useState<string>('');
    const [opened, setOpened] = useState<boolean>(true);
    const toggle = () => setOpened(!opened);
    const handleSelect = (name: string): void => setSelected(name);

    return (
        <motion.div
            animate={{width: opened ? "18%" : "6%"}}
            initial={{width: "20%"}}
            transition={{duration: 0.3}}
            className="h-full text-white flex items-center flex-col flex-wrap bg-transparent"
        >
            <div
                className={opened ? `h-28 w-full py-5 flex flex-row items-center justify-around` : `h-28 w-full py-5 flex flex-row items-center justify-center`}>
                {opened && (
                    <Link to={Paths.HOME} className="text-xl">
                        <motion.button
                            initial={{visibility: "hidden", opacity: 0}}
                            animate={{visibility: "visible", opacity: 1}}
                            transition={{delay: 0.2, duration: 0.7}}
                            onClick={() => setSelected('')}
                            >
                            PROJECT MANAGER
                        </motion.button>
                    </Link>
                )}
                <button onClick={toggle}>
                    <HamburgerIcon className="h-10 w-10 fill-white"/>
                </button>
            </div>
            <div className={`${opened ? "pl-6" : "pl-[20%]"} w-full flex-grow`}>
                {
                    items.map(item => (
                        <SidebarItem
                            key={item.name}
                            item={item}
                            handleSelect={handleSelect}
                            selected={selected}
                            opened={opened}
                        />
                    ))
                }
            </div>
            <div className="flex flex-row justify-center px-6 w-full h-16 rounded-b-[20px]">
                <div className="flex px-3 items-center justify-center ">
                    <UserButton/>
                </div>
                {
                    opened &&
                    <motion.div
                        initial={{visibility: "hidden", opacity: 0}}
                        animate={{visibility: "visible", opacity: 1}}
                        transition={{delay: 0.2, duration: 0.7}}
                        className="flex px-3 flex-col items-center justify-center">
                        Ime Priimek
                    </motion.div>
                }
            </div>
            {
                showReturn &&
                <Link to={Paths.HOME} className="w-full py-6">
                    <div className="flex flex-row items-center justify-around w-full">
                        <ReturnIcon className="h-10 w-10 fill-white" />
                    </div>
                </Link>
            }
        </motion.div>
    )
}

const SidebarItem: React.FC<SidebarItemProps> = ({item, handleSelect, selected, opened}) => {
    const select = (): void => {
        handleSelect(item.name);
    }
    const IconComponent = item.iconComponent;

    return (
        <Link onClick={select} to={item.linkPath} className="group">
            <div
                className={selected === item.name ? "flex flex-row items-center tracking-wider text-black bg-white py-3 rounded-l-full h-20" : "h-20 flex flex-row items-center hover:fill-black tracking-wider bg-transparent py-3 hover:text-black hover:bg-white hover:rounded-l-full"}>
                {
                    IconComponent &&
                    <IconComponent
                        className={selected === item.name ? "h-10 w-10 fill-black ml-3" : "h-10 w-10 fill-white group-hover:fill-black ml-3"}/>}
                {
                    opened &&
                    <motion.div
                        initial={{visibility: "hidden", opacity: 0}}
                        animate={{visibility: "visible", opacity: 1}}
                        transition={{delay: 0.2, duration: 0.7}}
                        className="pl-3 text-xl">
                        {item.name}
                    </motion.div>
                }
            </div>
        </Link>
    )
}

export default SidebarTemplate;
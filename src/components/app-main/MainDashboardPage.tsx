import {useState} from "react";
import {motion} from "framer-motion";
import {RelevantProjectsSection} from "./dashboard/RelevantProjectsSection";
import ExpandIcon from "../../assets/icons/expand-icon.svg?react";
import CloseIcon from "../../assets/icons/arrow-decrease-icon.svg?react";
import {RemindersSection} from "./dashboard/RemindersSection";
import {AnalyticsSection} from "./dashboard/AnalyticsSection";

export const MainDashboardPage = () => {
    const [view, setView] = useState<string>('all');

    const handleSelect = (section: string): void => {
        setView(section);
    };

    return (
        <div className="h-full p-5 overflow-hidden">
            <div className="flex h-full">
                <motion.div
                    animate={{
                        opacity: view === 'reminders' ? 0 : 1,
                        display: view === 'reminders' ? 'none' : 'flex',
                        width: view === 'reminders' ? "0%" : view !== 'all' ? '100%' : '70%'
                    }}
                    transition={{duration: 0.5}}
                    initial={{width: "70%"}}
                    className={`flex flex-col ${view === "all" ? "p-2 space-y-4" : view === 'projects' && 'space-y-0'}`}>
                    <motion.div
                        animate={{
                            opacity: view === 'all' || view === 'analytics' ? 1 : 0,
                            display: view === 'all' || view === 'analytics' ? 'flex' : 'none',
                            height: view === 'analytics' || view === 'all' ? '100%' : '0%'
                        }}
                        transition={{duration: 0.5}}
                        initial={{width: "100%", height: "100%"}}
                        className={`border-gray-200 border-solid border-2 rounded-[25px]`}>
                        <div className="flex flex-col flex-grow p-3">
                            <div className="flex justify-end">
                                {
                                    view === 'all' ?
                                        <button
                                            onClick={() => handleSelect('analytics')}>
                                            <ExpandIcon className="h-8 w-8 fill-gray-500"/>
                                        </button> :
                                        <button
                                            onClick={() => handleSelect('all')}
                                            className="uppercase">
                                            <CloseIcon className="h-8 w-8 fill-gray-500"/>
                                        </button>
                                }
                            </div>
                            <div className="flex flex-grow">
                                <AnalyticsSection />
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{
                            opacity: view === 'all' || view === 'projects' ? 1 : 0,
                            display: view === 'all' || view === 'projects' ? 'flex' : 'none',
                            height: view === 'projects' || view === 'all' ? '100%' : '0%'
                        }}
                        transition={{duration: 0.5}}
                        initial={{width: "100%", height: "100%"}}
                        className={`border-gray-200 border-solid border-2 rounded-[25px]`}>
                        <div className="flex flex-col flex-grow p-3">
                            <div className="flex justify-end">
                                {
                                    view === 'all' ?
                                        <button
                                            onClick={() => handleSelect('projects')}>
                                            <ExpandIcon className="h-8 w-8 fill-gray-500"/>
                                        </button> :
                                        <button
                                            onClick={() => handleSelect('all')}
                                            className="uppercase">
                                            <CloseIcon className="h-8 w-8 fill-gray-500"/>
                                        </button>
                                }
                            </div>
                            <div className="flex flex-grow">
                                <RelevantProjectsSection/>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                <motion.div
                    animate={{
                        opacity: view === 'all' || view === 'reminders' ? 1 : 0,
                        display: view === 'all' || view === 'reminders' ? 'block' : 'hidden',
                        width: view === 'all' ? "30%" : view === 'reminders' ? '100%' : '0%',
                    }}
                    transition={{duration: 0.5}}
                    initial={{width: "30%"}}
                    className={`${view === 'all' && 'p-2'}`}>
                    <div className=" flex flex-col flex-grow w-full h-full border-gray-200 border-solid border-2 rounded-[25px] p-3">
                        <div className="flex justify-end">
                            {
                                view === 'all' ?
                                    <button
                                        onClick={() => handleSelect('reminders')}>
                                        <ExpandIcon className="h-8 w-8 fill-gray-500"/>
                                    </button> :
                                    <button
                                        onClick={() => handleSelect('all')}
                                        className="uppercase">
                                        <CloseIcon className="h-8 w-8 fill-gray-500"/>
                                    </button>
                            }
                        </div>
                        <div className="flex flex-grow">
                            <RemindersSection />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

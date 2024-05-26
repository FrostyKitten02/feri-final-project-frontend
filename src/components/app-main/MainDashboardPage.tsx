import {useState} from "react";
import {motion} from "framer-motion";

export const MainDashboardPage = () => {
    const [view, setView] = useState<string>('all');
    const status:boolean = false;

    const handleSelect = (section: string): void => {
        setView(section);
        console.log(section);
    };

    return (
        <div className="h-full p-5 overflow-hidden">
            <div className="flex h-full">
                <motion.div
                    animate={{
                        opacity: view === 'reminders' ? 0 : 1,
                        width: view === 'reminders' ? "0%" : view !== 'all' ? '100%' : '70%'
                    }}
                    transition={{duration: 0.5}}
                    initial={{width: "70%"}}
                    className={`flex flex-col ${view === "all" ? "p-2 space-y-4": view === 'projects' && 'space-y-0'}`}>
                    <motion.div
                        animate={{
                            opacity: view === 'all' || view === 'tasks' ? 1 : 0,
                            height: view === 'tasks' || view === 'all' ? '100%' : '0%'
                        }}
                        transition={{duration: 0.5}}
                        initial={{width: "100%", height: "100%"}}
                        className={`border-gray-200 border-solid border-2 rounded-[25px] ${view !== 'tasks' ? view !== 'all' ? 'p-0' : 'p-5' : ''}`}>
                        <div className="h-full">
                            <button
                                onClick={() => handleSelect('tasks')}
                                className="uppercase">
                                currently working on tasks
                            </button>
                            {
                                !status &&
                                <div className="h-full flex justify-center items-center">
                                    You aren't working on any tasks currently.
                                </div>
                            }
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{
                            opacity: view === 'all' || view === 'projects' ? 1 : 0,
                            height: view === 'projects' || view === 'all' ? '100%' : '0%'
                        }}
                        transition={{duration: 0.5}}
                        initial={{width: "100%", height: "100%"}}
                        className={`border-gray-200 border-solid border-2 rounded-[25px] ${view !== 'projects' ? view !== 'all' ? 'p-0' : 'p-5' : ''}`}>
                        <div className="h-full">
                            <button
                                onClick={() => handleSelect('projects')}
                                className="uppercase">
                                currently relevant / in progress projects
                            </button>
                            {
                                !status &&
                                <div className="h-full flex justify-center items-center">
                                    You aren't working on any projects currently.
                                </div>
                            }
                        </div>
                    </motion.div>
                </motion.div>
                <motion.div
                    animate={{
                        opacity: view === 'all' || view === 'reminders' ? 1 : 0,
                        width: view === 'all' ? "30%" : view === 'reminders' ? '100%' : '0%',
                    }}
                    transition={{duration: 0.5}}
                    initial={{width: "30%"}}
                    className={`${view === 'all' && 'p-2'}`}>
                    <div className="w-full h-full border-gray-200 border-solid border-2 rounded-[25px] p-5">
                        <div className="h-full">
                            <button
                                onClick={() => handleSelect('reminders')}
                                className="">
                                REMINDERS
                            </button>
                            {
                                !status &&
                                <div className="h-full flex justify-center items-center">
                                    You don't have any reminders.
                                </div>
                            }
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

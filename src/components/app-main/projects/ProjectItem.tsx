import {useNavigate} from "react-router-dom";
import TextUtil from "../../../util/TextUtil";
import SessionUtil from "../../../util/SessionUtil";
import {HiCalendar} from "react-icons/hi";
import {FC} from "react";
import {ProjectItemProps} from "../../../interfaces";
import {useAuth} from "@clerk/clerk-react";

export const ProjectItem: FC<ProjectItemProps> = ({project}) => {
    const navigate = useNavigate();
    const progress: number = TextUtil.returnProgress(project?.startDate, project?.endDate);
    const {text, color} = TextUtil.returnProgressText(progress);
    const {userId} = useAuth();
    const handleNavigate = () => {
        navigate(`/project/${project?.id}/project-dashboard`);
        SessionUtil.setSidebarSelect('project dashboard');
    }
    return (
        project &&
        <div
            className="p-5 h-72 w-[450px]">
            <button
                className="w-full h-full"
                onClick={() => handleNavigate()}>
                <div
                    className="flex hover:bg-gray-100 items-center rounded-xl p-6 h-full border border-gray-200 border-solid">
                    <div className="flex flex-row w-full h-full">
                        <div className="flex flex-col flex-grow">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center justify-center rounded-full w-6 h-6 bg-red-200">
                                        <HiCalendar className="h-4 w-4 fill-secondary"/>
                                    </div>
                                    <div className="px-2 italic text-xs text-muted">
                                        {TextUtil.refactorDate(project.startDate)}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    {
                                        project.ownerId === userId &&
                                        <div
                                            className="flex bg-secondary w-fit px-2 rounded-lg ml-2 justify-start items-center">
                                            <p className="font-semibold italic text-sm uppercase">
                                                owner
                                            </p>
                                        </div>
                                    }
                                    <div
                                        className={`flex ${color} w-fit px-2 rounded-lg ml-2 justify-start items-center`}>
                                        <p className="font-semibold italic text-sm uppercase">
                                            {text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-grow">
                                <div className="w-[1px] bg-gray-200 mx-[12px] my-2"/>
                                <div className="flex flex-col flex-grow">
                                    <div
                                        className="flex items-center justify-center text-xl uppercase font-bold flex-grow">
                                        {project.title}
                                    </div>
                                    <div className="text-end">
                                        {progress.toFixed(0) + `%`}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center">
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center justify-center rounded-full w-6 h-6 bg-red-200">
                                        <HiCalendar className="h-4 w-4 fill-secondary"/>
                                    </div>
                                    <div className="px-2 italic text-xs text-muted">
                                        {TextUtil.refactorDate(project.endDate)}
                                    </div>
                                </div>
                                <div className="flex-grow ml-4 p-0">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 bg-gray-200">
                                        <div className="bg-primary h-2.5 rounded-full"
                                             style={{width: `${progress}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    )
}
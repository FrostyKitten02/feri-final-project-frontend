import {useNavigate} from "react-router-dom";
import TextUtil from "../../../util/TextUtil";
import SessionUtil from "../../../util/SessionUtil";
import {HiCalendar} from "react-icons/hi";
import {FC} from "react";
import {ProjectItemProps} from "../../../interfaces";
import {useUser} from "@clerk/clerk-react";
import {ProgressBar} from "@tremor/react";
import {Label} from "flowbite-react";

export const ProjectItem: FC<ProjectItemProps> = ({project}) => {
    const navigate = useNavigate();
    const {user} = useUser();
    const progress: number = TextUtil.returnProgress(
        project?.startDate,
        project?.endDate
    );
    const {text, color} = TextUtil.returnProgressText(progress);
    const handleNavigate = () => {
        if (project?.ownerId === user?.id) {
            navigate(`/project/${project?.id}/project-dashboard`);
            SessionUtil.setSidebarSelect("project dashboard");
        }
    };

    return (
        project && (
            <div className="p-5">
                <div className={`flex flex-col w-full h-full border border-gray-200 border-solid rounded-xl`}>
                    <button
                        className={`${project.ownerId === user?.id ? "hover:bg-gray-100 transition delay-50" : "cursor-default"} p-5 flex flex-grow rounded-xl`}
                        onClick={() => handleNavigate()}
                    >
                        <div className="flex flex-col flex-grow h-full">
                            <div className="flex flex-row items-center">
                                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                    <HiCalendar className="h-4 w-4 fill-primary"/>
                                </div>
                                <div className="pl-2 text-xs text-muted">
                                    {TextUtil.refactorDate(project.startDate)}
                                </div>
                                <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                                <div className="pr-2 text-xs text-muted">
                                    {TextUtil.refactorDate(project.endDate)}
                                </div>
                                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                    <HiCalendar className="h-4 w-4 fill-primary"/>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-center py-6">
                                {TextUtil.truncateString(project.title, 70)}
                            </div>
                            <div>
                                <ProgressBar
                                    value={progress}
                                    color={color}
                                    showAnimation={true}
                                    className="py-2"
                                />
                                <div className="text-muted text-start uppercase text-sm pb-4">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-warning w-2 h-2 mr-2"/>
                                        <div className="text-sm uppercase tracking-wider">
                                             {`${text}: ${Math.floor(TextUtil.returnProgress(project?.startDate, project?.endDate)).toString()}%`}
                                        </div>
                                    </div>
                                      </div>
                            </div>
                            {project.ownerId === user?.id ?
                                <div>
                                    <div className="flex flex-row items-center pt-2">
                                        <div className="w-[7%] h-[1px] bg-gray-300"/>
                                        <Label className="px-2 uppercase text-muted">
                                            project details
                                        </Label>
                                        <div className="flex-grow h-[1px] bg-gray-300"/>
                                    </div>
                                </div> :
                                <div>
                                    <div className="space-y-4 h-full">
                                        <div className="flex flex-row items-center pt-2">
                                            <div className="w-[7%] h-[1px] bg-gray-300"/>
                                            <Label className="px-2 uppercase text-muted">
                                                collaboration duration
                                            </Label>
                                            <div className="flex-grow h-[1px] bg-gray-300"/>
                                        </div>
                                        <div className="flex flex-col items-center font-semibold">
                                            <div className="text-2xl">
                                                {TextUtil.refactorDate(project.startDate)} spremeni
                                            </div>
                                            <div>
                                                -
                                            </div>
                                            <div className="text-2xl">
                                                {TextUtil.refactorDate(project.endDate)} spremeni
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center pt-2">
                                            <div className="w-[7%] h-[1px] bg-gray-300"/>
                                            <Label className="px-2 uppercase text-muted">
                                                occupancy
                                            </Label>
                                            <div className="flex-grow h-[1px] bg-gray-300"/>
                                        </div>
                                        <div className="text-2xl font-semibold">
                                            5% spremeni
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </button>
                </div>
            </div>
        )
    );
};
{
    /*
    <div className="flex flex-row items-center">
                                        {
                                            project.ownerId === user?.id &&
                                            <ProjectModal
                                                edit={true}
                                                handleProjectSubmit={handleEditProject}
                                                projectId={project.id}
                                            />
                                        }
                                    </div>



                                    <div className="flex flex-col">
                            <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                            <div className="flex flex-row justify-between">
                                <div className="pl-4 flex flex-row space-x-3">
                                    <div className="flex flex-row items-center">
                                        <LuPackage size="22"/>
                                        <div className="pl-1 text-lg font-mono">
                                            {project.workPackageCount}
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <IoPeopleOutline size="22"/>
                                        <div className="pl-1 text-lg font-mono">
                                            {project.peopleCount}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-2 flex flex-row items-center space-x-2 justify-end">
                                    <div className="flex bg-blue-200 w-fit px-2 rounded-lg justify-start items-center">
                                        <p className="font-semibold italic text-sm uppercase">
                                            {project.ownerId === userId ? "owned" : "assigned"}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex ${color} w-fit px-2 rounded-lg  justify-start items-center`}
                                    >
                                        <p className="font-semibold italic text-sm uppercase">
                                            {text}
                                            {project.workPackages?.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
     */
}
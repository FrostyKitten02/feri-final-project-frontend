import TextUtil from "../../../util/TextUtil";
import {ProjectDto, ProjectListSearchParams} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {useEffect, useState} from "react";
import {Label, Spinner} from "flowbite-react";
import {HiCalendar} from "react-icons/hi";
import {LuPackage} from "react-icons/lu";
import {IoPeopleOutline} from "react-icons/io5";

export const UpcomingProject = () => {
    const [upcomingProject, setUpcomingProject] = useState<ProjectDto>();
    const [loading, setLoading] = useState<boolean>(true);
    const requestArgs = useRequestArgs();
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const today = TextUtil.formatFormDate(new Date());
                const params: ProjectListSearchParams = {
                    endDateFrom: "",
                    startDateTo: "",
                    startDateFrom: today,
                    endDateTo: ""
                }
                const res = await projectAPI.listProjects(
                    {
                        elementsPerPage: 1,
                        pageNumber: 1,
                    },
                    {
                        ascending: true,
                        fields: [
                            "CREATED_AT"
                        ]
                    },
                    params,
                    await requestArgs.getRequestArgs()
                );
                if (res.status === 200) {
                    if (res.data.projects)
                        setUpcomingProject(res.data.projects[0]);
                }
                setLoading(false);
            } catch (error) {
            }
        };
        fetchProjects();
    }, [])
    return (
        <div className="relative p-5 z-0 flex-grow">
            <div
                className="border-gray-200 flex h-full rounded-[20px] p-5 border-solid border-[1px]">
                {
                    loading ?
                        <div className="flex justify-center items-center h-full w-full">
                            <Spinner size="xl"/>
                        </div> : upcomingProject ?
                            <div className="flex flex-col flex-grow">
                                <div className="flex flex-row items-center">
                                    <div
                                        className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                        <HiCalendar className="h-4 w-4 fill-primary"/>
                                    </div>
                                    <div className="pl-2 text-xs text-muted">
                                        {TextUtil.refactorDate(upcomingProject?.startDate)}
                                    </div>
                                    <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                                    <div className="pr-2 text-xs text-muted">
                                        {TextUtil.refactorDate(upcomingProject?.endDate)}
                                    </div>
                                    <div
                                        className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                        <HiCalendar className="h-4 w-4 fill-primary"/>
                                    </div>
                                </div>
                                <div
                                    className="text-xl flex items-center justify-center font-semibold text-center py-3 flex-grow">
                                    {TextUtil.truncateString(upcomingProject?.title, 70)}
                                </div>
                                <div className="flex flex-row items-center">
                                    <div className="w-[7%] h-[1px] bg-gray-300"/>
                                    <Label className="px-2 uppercase text-muted">
                                        project details
                                    </Label>
                                    <div className="flex-grow h-[1px] bg-gray-300"/>
                                </div>
                                <div className="flex justify-evenly pt-2">
                                    <div className="flex space-x-2 flex-row items-center">
                                        <LuPackage size="22"/>
                                        <div className="text-lg">
                                            {upcomingProject?.workPackageCount}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 flex-row items-center">
                                        <IoPeopleOutline size="22"/>
                                        <div className="text-lg">
                                            {upcomingProject?.peopleCount}
                                        </div>
                                    </div>
                                </div>
                            </div> :
                            <div className="flex-grow flex items-center justify-center text-muted">
                                There is no upcoming project.
                            </div>
                }
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                upcoming project
            </div>
        </div>
    )
}
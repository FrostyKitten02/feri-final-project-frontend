import {useEffect, useState} from "react";
import {PageInfo, ProjectDto, ProjectListSearchParams} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import TextUtil from "../../../util/TextUtil";
import {HiCalendar} from "react-icons/hi";
import {ProgressBar} from "@tremor/react";
import {Label, Spinner} from "flowbite-react";
import {CustomPagination} from "../../template/pagination/CustomPagination";

export const ActiveProjectsSection = () => {
    const [relevantProjects, setRelevantProjects] = useState<Array<ProjectDto>>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const requestArgs = useRequestArgs();

    useEffect(() => {
        fetchProjects();
    }, [pageNumber]);
    const fetchProjects = async () => {
        try {
            const today = TextUtil.formatFormDate(new Date());
            const params: ProjectListSearchParams = {
                endDateFrom: today,
                startDateTo: today,
                startDateFrom: "",
                endDateTo: ""
            }
            const res = await projectAPI.listProjects(
                {
                    elementsPerPage: 2,
                    pageNumber: pageNumber,
                },
                {
                    ascending: true,
                    fields: ["CREATED_AT"],
                },
                params,
                requestArgs
            );
            if (res.status === 200) {
                if (res.data.projects) {
                    setRelevantProjects(res.data.projects);
                }
                if (res.data.pageInfo)
                    setPageInfo(res.data.pageInfo);
                setIsLoading(false);
            }
        } catch (error) {

        }
    };
    return (
        <div className="relative p-5 z-0 flex-grow">
            <div
                className="border-gray-200 flex h-full rounded-[20px] p-5 border-solid border-[1px]">
                {
                    isLoading ?
                        <div className="flex justify-center items-center h-full">
                            <Spinner size="xl"/>
                        </div> :
                        <div className="flex space-x-5 w-full">
                            {
                                relevantProjects?.map((project, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="w-1/2 border-solid border-[1px] rounded-[20px] border-gray-200 pt-5 px-5 space-y-5 flex flex-col">
                                            <div className="flex flex-row items-center">
                                                <div
                                                    className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                                    <HiCalendar className="h-4 w-4 fill-primary"/>
                                                </div>
                                                <div className="pl-2 text-xs text-muted">
                                                    {TextUtil.refactorDate(project.startDate)}
                                                </div>
                                                <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                                                <div className="pr-2 text-xs text-muted">
                                                    {TextUtil.refactorDate(project.endDate)}
                                                </div>
                                                <div
                                                    className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                                    <HiCalendar className="h-4 w-4 fill-primary"/>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-semibold text-center py-3">
                                                {project.title}
                                            </div>
                                            <div>
                                                <ProgressBar
                                                    value={TextUtil.returnProgress(project?.startDate, project?.endDate)}
                                                    color="blue"
                                                    showAnimation={true}
                                                    className="py-2"
                                                />
                                                <div className="text-muted uppercase text-sm">
                                                    {`Progress: ${Math.floor(TextUtil.returnProgress(project?.startDate, project?.endDate)).toString()}%`}
                                                </div>
                                            </div>
                                            <div className="bg-red-50 flex-grow">
                                                <div className="h-1/2">
                                                    <div className="flex flex-row items-center">
                                                        <div className="w-[7%] h-[1px] bg-gray-300"/>
                                                        <Label className="px-2 uppercase text-muted">
                                                            annual report
                                                        </Label>
                                                        <div className="flex-grow h-[1px] bg-gray-300"/>
                                                    </div>
                                                    <div>
                                                        report
                                                    </div>
                                                </div>
                                                <div className="h-1/2">
                                                    <div className="flex flex-row items-center">
                                                        <div className="w-[7%] h-[1px] bg-gray-300"/>
                                                        <Label className="px-2 uppercase text-muted">
                                                            monthly report
                                                        </Label>
                                                        <div className="flex-grow h-[1px] bg-gray-300"/>
                                                    </div>
                                                    <div>
                                                        report
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })

                            }
                        </div>
                }
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white bottom-0 font-medium right-20 uppercase flex px-2">
                {pageInfo?.totalElements && pageInfo?.elementsPerPage && (
                    <CustomPagination
                        totalPages={(Math.ceil(pageInfo.totalElements / pageInfo.elementsPerPage))}
                        onPageChange={setPageNumber}
                        currentPage={pageNumber}
                        nextLabelText=""
                        backLabelText=""
                    />
                )}
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                active projects
            </div>
        </div>
    )
}
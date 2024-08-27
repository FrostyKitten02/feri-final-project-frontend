import {useEffect, useState} from "react";
import {PageInfo, PersonDto, ProjectDto, ProjectListSearchParams} from "../../../../temp_ts";
import {personAPI, projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import TextUtil from "../../../util/TextUtil";
import {Spinner} from "flowbite-react";
import {CustomPagination} from "../../template/pagination/CustomPagination";
import {ProjectSectionItem} from "./ProjectSectionItem";
import RequestUtil from "../../../util/RequestUtil";

export const ActiveProjectsSection = () => {
    const [relevantProjects, setRelevantProjects] = useState<Array<ProjectDto>>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPerson, setCurrentPerson] = useState<PersonDto>();
    const requestArgs = useRequestArgs();
    useEffect(() => {
        fetchProjects();
        fetchCurrentPerson();
    }, [pageNumber]);

    const fetchCurrentPerson = async () => {
        try {
            const response = await personAPI.getCurrentPerson(await requestArgs.getRequestArgs());
            if (response.status === 200) {
                setCurrentPerson(response.data.person);
            }
        } catch (err) {}
    }
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
                await requestArgs.getRequestArgs()
            );
            if (res.status === 200) {
                if (res.data.projects) {
                    setRelevantProjects(res.data.projects);
                }
                if (res.data.pageInfo)
                    setPageInfo(res.data.pageInfo);
            }
            setIsLoading(false);
        } catch (error) {
            RequestUtil.handleAxiosRequestError(error);
        }
    };
    return (
        <div className="relative p-5 z-0 flex-grow">
            <div
                className="border-gray-200 flex h-full rounded-[20px] p-5 border-solid border-[1px]">
                {
                    isLoading ?
                        <div className="flex flex-grow justify-center items-center h-full">
                            <Spinner size="xl"/>
                        </div> :
                        <div className="flex space-x-5 w-full">
                            {
                                (relevantProjects && currentPerson && relevantProjects?.length > 0) ? relevantProjects?.map((project, index) => {
                                    return (
                                        <ProjectSectionItem key={index} project={project} currentPerson={currentPerson} />
                                    )
                                }):
                                    <div className="w-full flex items-center text-center justify-center text-muted">
                                        There currently aren't any active projects.
                                    </div>
                            }
                        </div>
                }
            </div>
            {
                relevantProjects && relevantProjects.length > 0 &&
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
            }
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                active projects
            </div>
        </div>
    )
}
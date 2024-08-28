import {useEffect, useState} from "react";
import {personAPI, projectAPI} from "../../../util/ApiDeclarations";
import {
    ListProjectResponse,
    PageInfoRequest, PersonDto,
    ProjectListSearchParams,
    ProjectSortInfoRequest,
} from "../../../../client";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectItem} from "./ProjectItem";
import {CustomPagination} from "../../template/pagination/CustomPagination";
import {ProjectFilter} from "./ProjectFilter";
import {SelectedItemProps} from "../../template/inputs/inputsInterface";
import ParamUtil from "../../../util/ParamUtil";
import {Spinner} from "flowbite-react";
import {ProjectModal} from "./ProjectModal";
import RequestUtil from "../../../util/RequestUtil";
import {IoFolderOutline} from "react-icons/io5";

export const MyProjectsPage = () => {
    const [projects, setProjects] = useState<ListProjectResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [elementsPerPage] = useState<number>(3);
    const [selectedStatus, setSelectedStatus] = useState<SelectedItemProps>({value: "", text: "",});
    const requestArgs = useRequestArgs();
    const [currentPerson, setCurrentPerson] = useState<PersonDto>();

    useEffect(() => {
        setIsLoading(true);
        fetchProjects(pageNumber, elementsPerPage, selectedStatus)
            .then(() => setIsLoading(false))
            .catch(() => {
                setIsLoading(false);
            });
    }, [pageNumber, selectedStatus]);

    useEffect(() => {
        const fetchCurrentPerson = async () => {
            try {
                const response = await personAPI.getCurrentPerson(await requestArgs.getRequestArgs());
                if (response.status === 200) {
                    setCurrentPerson(response.data.person);
                }
            } catch (err) {
            }
        }
        fetchCurrentPerson();
    }, [])
    const onPageChange = (page: number) => {
        setPageNumber(page);
    };
    const handleProjectAdd = () => {
        fetchProjects(pageNumber, elementsPerPage, selectedStatus);
    };
    const fetchProjects = async (
        pageNum: number,
        elementsNum: number,
        status: SelectedItemProps
    ): Promise<void> => {
        const pageInfo: PageInfoRequest = {
            elementsPerPage: elementsNum,
            pageNumber: pageNum,
        };
        const sortInfo: ProjectSortInfoRequest = {
            ascending: true,
            fields: ["CREATED_AT"],
        };
        const searchParams: ProjectListSearchParams = {
            searchStr: undefined,
            searchOnlyOwnedProjects: undefined,
            startDateTo: undefined,
            startDateFrom: undefined,
            endDateTo: undefined,
            endDateFrom: undefined,
            ...ParamUtil.returnSelectedItemProps(status),
        };
        try {
            const response = await projectAPI.listProjects(
                pageInfo,
                sortInfo,
                searchParams,
                await requestArgs.getRequestArgs()
            );
            if (response.status === 200 && response.data) {
                setProjects(response.data);
                if (
                    response.data.pageInfo &&
                    response.data.pageInfo.totalElements &&
                    response.data.pageInfo.elementsPerPage
                ) {
                    const newTotalPages = Math.ceil(
                        response.data.pageInfo.totalElements /
                        response.data.pageInfo.elementsPerPage
                    );
                    setTotalPages(newTotalPages);
                    setPageNumber(pageNum);
                }
            }
        } catch (error) {
            RequestUtil.handleAxiosRequestError(error);
        }
    };

    return (
        <div className="flex flex-col flex-grow p-5">
            {isLoading ? (
                <div className="flex h-full flex-col justify-center items-center font-bold text-3xl">
                    <Spinner size="xl"/>
                </div>
            ) : (
                <>
                    <div className="relative p-5">
                        <div
                            className="border-[1px] border-solid rounded-[20px] border-gray-200 flex flex-col flex-grow p-5">
                            <ProjectFilter
                                setSelectedStatus={setSelectedStatus}
                                selectedStatus={selectedStatus}
                            />
                        </div>
                        <div
                            className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                            filters
                        </div>
                    </div>
                    <>
                        <div className="relative flex-grow p-5">
                            <div
                                className="border-[1px] h-full border-solid rounded-[20px] border-gray-200 flex flex-col flex-grow p-5">
                                <div className="flex justify-center items-center h-full">
                                    {projects?.projects && projects.projects.length > 0 ? (
                                        <div className="grid grid-cols-3 w-full h-full">
                                            {projects.projects.map((project) => (
                                                currentPerson &&
                                                <ProjectItem
                                                    key={project.id}
                                                    project={project}
                                                    handleEditProject={handleProjectAdd}
                                                    currentPerson={currentPerson}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex flex-col h-full items-center justify-center">
                                                <IoFolderOutline className="stroke-muted size-40 pb-6"/>
                                                <p className="text-2xl font-bold text-muted">No projects found.</p>
                                                <p className="pb-6 text-muted">
                                                    Navigate to the top right to create a project or click
                                                    the button below.
                                                </p>
                                                <ProjectModal
                                                    handleProjectSubmit={handleProjectAdd}
                                                    callToAction={true}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div
                                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                                projects
                            </div>
                            {projects?.projects && projects.projects.length > 0 && (
                                <div
                                    className="absolute rounded-[20px] text-center text-muted bg-white bottom-[4px] font-medium right-20 uppercase flex px-2">
                                    <CustomPagination
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                        currentPage={pageNumber}
                                        backLabelText=""
                                        nextLabelText=""
                                    />
                                </div>
                            )}
                            <div className="absolute right-0 top-0">
                                <div className="bg-white pl-3">
                                    <ProjectModal handleProjectSubmit={handleProjectAdd}/>
                                </div>
                            </div>
                        </div>
                    </>
                </>
            )}
        </div>
    );
};

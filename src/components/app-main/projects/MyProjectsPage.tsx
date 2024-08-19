import {useEffect, useState} from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {
    ListProjectResponse,
    PageInfoRequest,
    ProjectListSearchParams,
    ProjectSortInfoRequest
} from "../../../../temp_ts";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectItem} from "./ProjectItem";
import {CustomPagination} from "../../template/pagination/CustomPagination";
import {ProjectFilter} from "./ProjectFilter";
import {SelectedItemProps} from "../../template/inputs/inputsInterface";
import ParamUtil from "../../../util/ParamUtil";
import {Spinner} from "flowbite-react";

export const MyProjectsPage = () => {
    const [projects, setProjects] = useState<ListProjectResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [elementsPerPage] = useState<number>(6);
    const [selectedStatus, setSelectedStatus] = useState<SelectedItemProps>({value: "", text: ""});
    const requestArgs = useRequestArgs();

    const onPageChange = (page: number) => {
        setPageNumber(page);
    }
    const handleProjectAdd = () => {
        fetchProjects(pageNumber, elementsPerPage, selectedStatus);
    }
    const fetchProjects = async (pageNum: number, elementsNum: number, status: SelectedItemProps): Promise<void> => {
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
            ...ParamUtil.returnSelectedItemProps(status)
        }
        try {
            const response = await projectAPI.listProjects(
                pageInfo,
                sortInfo,
                searchParams,
                requestArgs
            );
            if (response.status === 200 && response.data) {
                setProjects(response.data);
                if (response.data.pageInfo && response.data.pageInfo.totalElements && response.data.pageInfo.elementsPerPage) {
                    const newTotalPages = Math.ceil(response.data.pageInfo.totalElements / response.data.pageInfo.elementsPerPage);
                    setTotalPages(newTotalPages);
                    setPageNumber(pageNum);
                }
            }
        } catch (error: any) {
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchProjects(pageNumber, elementsPerPage, selectedStatus)
            .then(() => setIsLoading(false))
            .catch(() => {
                setIsLoading(false);
            });
    }, [pageNumber, selectedStatus]);

    return (
        <div className="flex flex-col flex-grow bg-red-50 p-10">
            {
                isLoading ? (
                    <div className="flex h-full flex-col justify-center items-center font-bold text-3xl">
                        <Spinner size="xl" />
                    </div>
                ) :
                    <>
                        <div className="px-20 pb-14 flex justify-center items-center">
                            <ProjectFilter
                                setSelectedStatus={setSelectedStatus}
                                selectedStatus={selectedStatus}
                            />
                        </div>
                        {
                            projects?.projects && projects.projects.length > 0 ?
                                <>
                                    <div className="flex-grow w-full">
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex justify-center items-center">
                                                <div className="grid grid-cols-3">
                                                    {
                                                        projects.projects.map((project) => (
                                                            <ProjectItem
                                                                key={project.id}
                                                                project={project}
                                                                handleEditProject={handleProjectAdd}
                                                            />
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <CustomPagination
                                            totalPages={totalPages}
                                            onPageChange={onPageChange}
                                            currentPage={pageNumber}
                                            backLabelText="prev"
                                            nextLabelText="next"
                                        />
                                    </div>
                                </> :
                                <>
                                    <div className="flex-grow w-full">
                                        <div className="flex flex-col flex-grow">
                                            <div
                                                className="flex flex-grow h-full flex-col w-full justify-center items-center font-bold text-3xl space-y-4">
                                                <h1>No projects found...</h1>
                                                <p className="text-base text-gray-700">
                                                    Click the "Add new project" button to create a new project.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }

                    </>
            }
            {
                /*
                ) : (
                    <div className="flex flex-col flex-grow py-10">
                        <div className="px-20 pb-5 flex justify-center items-center">
                            <ProjectFilter
                                setSelectedStatus={setSelectedStatus}
                                selectedStatus={selectedStatus}
                            />
                        </div>
                        <div className="flex-grow w-full">
                            <div className="flex flex-col flex-grow">
                                <div
                                    className="flex flex-grow h-full flex-col w-full justify-center items-center font-bold text-3xl space-y-4">
                                    <h1>No projects found...</h1>
                                    <p className="text-base text-gray-700">
                                        Click the "Add new project" button to create a new project.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                 */
            }


        </div>
    );
}
{
    /*
    <ProjectModal handleProjectSubmit={handleProjectAdd} edit={false}/>
     */
}
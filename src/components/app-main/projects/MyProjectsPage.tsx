import {useEffect, useState} from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {ListProjectResponse, PageInfoRequest, ProjectSortInfoRequest} from "../../../../temp_ts";
import {toastError} from "../../toast-modals/ToastFunctions";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectItem} from "./ProjectItem";
import {ProjectModal} from "./ProjectModal";
import {CustomPagination} from "../../template/pagination/CustomPagination";
import {ProjectFilter} from "./ProjectFilter";

export default function MyProjectsPage() {

    const [projects, setProjects] = useState<ListProjectResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [elementsPerPage, setElementsPerPage] = useState<number>(6);

    useEffect(() => {
        setIsLoading(true);
        fetchProjects(pageNumber, elementsPerPage)
            .then(() => setIsLoading(false))
            .catch((error) => {
                setIsLoading(false);
                toastError(error);
            });
    }, [pageNumber]);

    const onPageChange = (page: number) => {
        setPageNumber(page);
    }

    const sortInfo: ProjectSortInfoRequest = {
        ascending: true,
        fields: ["CREATED_AT"],
    };
    const requestArgs = useRequestArgs();

    const fetchProjects = async (pageNum: number, elementsNum: number): Promise<void> => {
        const pageInfo: PageInfoRequest = {
            elementsPerPage: elementsNum,
            pageNumber: pageNum,
        };
        try {
            const response = await projectAPI.listProjects(
                pageInfo,
                sortInfo,
                undefined,
                requestArgs
            );
            if (response.status === 200 && response.data) {
                setProjects(response.data);
            }
            if (
                response.data.pageInfo &&
                response.data.pageInfo.totalElements &&
                response.data.pageInfo.elementsPerPage
            ) {
                const newTotalPages = Math.ceil(
                    response.data.pageInfo.totalElements / response.data.pageInfo.elementsPerPage
                );
                setTotalPages(newTotalPages);
            }
            setPageNumber(pageNum);
        } catch (error: any) {
            toastError(error);
        }
    };

    return (
        <div className="flex flex-col flex-grow py-10">
            <div className="h-28 px-20 flex flex-grow justify-between items-center">
                <div>
                    {/* todo add filters*/}
                    <ProjectFilter/>
                </div>
                <div>
                    <ProjectModal handleAddProject={() => fetchProjects(pageNumber, elementsPerPage)}/>
                </div>
            </div>
            <div className="flex flex-row w-full">
                <div className="flex flex-grow justify-end flex-col">
                    <div className="flex-grow pb-6">
                        {isLoading ? (
                            <div className="flex h-full flex-col justify-center items-center font-bold text-3xl">
                                <h1>Loading projects...</h1>
                            </div>
                        ) : projects?.projects && projects.projects.length > 0 ? (
                            <div className="flex flex-row justify-center items-center">
                                <div className="grid grid-cols-3">
                                    {
                                        projects.projects.map((project) => (
                                            <ProjectItem key={project.id} project={project}/>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex flex-grow h-full flex-col w-full justify-center items-center font-bold text-3xl space-y-4">
                                <h1>No projects found...</h1>
                                <p className="text-base text-gray-700">
                                    Click the "Add new project" button to create a new project.
                                </p>
                            </div>
                        )}
                        <div className="flex justify-center pt-6">
                            <CustomPagination totalPages={totalPages}
                                              onPageChange={onPageChange}
                                              currentPage={pageNumber}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
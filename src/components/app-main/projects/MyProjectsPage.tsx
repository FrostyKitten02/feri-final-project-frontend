import {useEffect, useState} from "react";
import Pagination from "./pagination/Pagination";
import {projectAPI} from "../../../util/ApiDeclarations";
import {ListProjectResponse, PageInfoRequest, ProjectSortInfoRequest} from "../../../../temp_ts";
import {toastError} from "../../toast-modals/ToastFunctions";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectItem} from "./ProjectItem";
import {ProjectModal} from "./ProjectModal";


export default function MyProjectsPage() {

    const [projects, setProjects] = useState<ListProjectResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastPage, setLastPage] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    useEffect(() => {
        setIsLoading(true);
        fetchProjects(pageNumber /*, ascending, fields*/)
            .then(() => setIsLoading(false))
            .catch((error) => {
                setIsLoading(false);
                toastError(error);
            });
    }, [pageNumber]);

    const nextPage = (): void => {
        const newPageNumber = pageNumber + 1;
        setPageNumber(newPageNumber);
    };

    const prevPage = (): void => {
        const newPageNumber = pageNumber > 1 ? pageNumber - 1 : 1;
        setPageNumber(newPageNumber);
    };

    // request parameters
    const sortInfo: ProjectSortInfoRequest = {
        ascending: true,
        fields: ["CREATED_AT"],
    };

    const requestArgs = useRequestArgs();

    const fetchProjects = async (
        pageNum: number
        // ascending: boolean,
        // fields: string[]
    ): Promise<void> => {
        // dynamically set pageNumber
        const pageInfo: PageInfoRequest = {
            elementsPerPage: 6,
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
                //console.log(response.data);
                if (response.data.pageInfo && response.data.pageInfo.lastPage === true) {
                    setLastPage(true);
                } else setLastPage(false);
            }
            if (
                response.data.pageInfo &&
                response.data.pageInfo.totalElements &&
                response.data.pageInfo.elementsPerPage
            ) {
                const newTotalPages = Math.ceil(
                    // calculate total pages
                    response.data.pageInfo.totalElements /
                    response.data.pageInfo.elementsPerPage
                );
                setTotalPages(newTotalPages);
            }
            setPageNumber(pageNum);
        } catch (error: any) {
            console.error(error);
            toastError(error);
        }
    };

    return (
        <div className="flex flex-col flex-grow py-10 px-20">
            <div className="h-28">
                {/* todo add filters*/}
                <ProjectModal handleAddProject={() => fetchProjects(pageNumber)} />
            </div>
            <div className="flex flex-row flex-grow w-full">
                <div className="flex flex-grow justify-end flex-col">
                    <div className="flex-grow">
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
                    </div>
                    {/*todo change pagination*/}
                    <div>
                        <Pagination
                            pageNumber={pageNumber}
                            lastPage={lastPage}
                            totalPages={totalPages}
                            onPageChange={(newPageNumber) =>
                                fetchProjects(newPageNumber )
                            }
                            nextPage={nextPage}
                            prevPage={prevPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
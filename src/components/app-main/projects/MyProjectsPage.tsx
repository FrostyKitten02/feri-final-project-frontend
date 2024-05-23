import {FC, useEffect, useState} from "react";
import AddNewProjectPage from "./modal/AddNewProjectModal";
import Pagination from "./pagination/Pagination";
import {Link} from "react-router-dom";
import {projectAPI} from "../../../util/ApiDeclarations";
import {ListProjectResponse, PageInfoRequest, ProjectSortInfoRequest} from "../../../../temp_ts";
import {toastError} from "../../toast-modals/ToastFunctions";
import {ProjectItemProps, ProjectListingProps} from "../../../interfaces";
import {useRequestArgs} from "../../../util/CustomHooks";
import AddProjectIcon from "../../../assets/icons/folder-badge-plus.svg?react";


export default function MyProjectsPage() {

    const [projects, setProjects] = useState<ListProjectResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [lastPage, setLastPage] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0); // last page and total page tracking

    // states needed for pagination and sorting
    const [pageNumber, setPageNumber] = useState<number>(1);

    // const [ascending, setAscending] = useState<boolean>(true);
    //const [fields, setFields] = useState<string[]>(["CREATED_AT"]); ////// TO DO: implement sorting //////

// framer motion modal states and functions
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        fetchProjects(pageNumber /*, ascending, fields*/)
            .then(() => setIsLoading(false))
            .catch((error) => {
                setIsLoading(false);
                toastError(error);
            });
    }, [pageNumber]);


    const close = (): void => {
        setModalOpen(false);
    };

    const open = (): void => {
        setModalOpen(true);
    };

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
            elementsPerPage: 5,
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
                if (response.data.pageInfo?.lastPage === true) {
                    setLastPage(true);
                } else {
                    setLastPage(false);
                }
            }

            if (
                response.data.pageInfo?.totalElements &&
                response.data.pageInfo?.elementsPerPage
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
        <div className="flex flex-row flex-grow h-full">
            <div>
                {modalOpen && (
                    <AddNewProjectPage
                        handleClose={close}
                        handleAddProject={() =>
                            fetchProjects(pageNumber /*, ascending, fields*/)
                        }
                    />
                )}
            </div>
            <div
                className="flex flex-col px-10 py-10 w-full border-b-2 border-l-2 border-solid rounded-bl-2xl border-gray-200">
                <ProjectListing
                    isLoading={isLoading}
                    allProjects={projects}
                />
                <Pagination
                    pageNumber={pageNumber}
                    lastPage={lastPage}
                    totalPages={totalPages}
                    onPageChange={(newPageNumber) =>
                        fetchProjects(newPageNumber /*ascending, fields*/)
                    }
                    nextPage={nextPage}
                    prevPage={prevPage}
                />
            </div>
            <div
                className="flex flex- w-[7%] border-x-2 border-b-2 rounded-br-2xl border-solid border-gray-200">
                <div className="flex justify-center w-full h-[10%] items-center">
                    <button onClick={() => (modalOpen && modalOpen ? close() : open())}>
                        <AddProjectIcon className="h-12 w-12 fill-black hover:fill-secondary"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

const ProjectListing: FC<ProjectListingProps> = ({isLoading, allProjects}) => {
    return (
        <div className="flex-grow">
            <div className="flex flex-row h-full">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center font-bold text-3xl">
                        <h1>Loading projects...</h1>
                    </div>
                ) : allProjects && allProjects.projects && allProjects.projects.length > 0 ? (
                    <div className="grid flex-grow grid-cols-3 gap-y-10 gap-x-5">
                        {
                            allProjects.projects.map((project) => (
                                <ProjectItem project={project}/>
                            ))
                        }
                    </div>
                ) : (
                    <div
                        className="flex flex-col w-full justify-center items-center font-bold text-3xl space-y-4">
                        <h1>No projects found...</h1>
                        <p className="text-base text-gray-700">
                            Click the "Add new project" button to create a new project.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

const ProjectItem: FC<ProjectItemProps> = ({project}) => {
    return (
        project &&
        <Link
            key={project.id}
            className="cursor-pointer w-[90%] h-[90%] hover:bg-gray-100"
            to={`/${project.id}`}
        >
            <div
                className="flex items-center rounded-xl p-6 h-full border border-gray-200 border-solid shadow-xl">
                <div className="w-full h-full">
                    <div className="border-l-4 border-solid border-rose-500 w-full">
                        <div
                            className="flex bg-rose-200 w-fit px-2 rounded-lg ml-2 justify-start items-center">
                            <p className="font-semibold italic text-gray-700 text-sm">
                                ID: {project.id?.slice(0, 8)}...
                                {project.id?.slice(-4)}
                            </p>
                        </div>
                        <h1 className="font-bold pl-4 text-xl">
                            {project.title}
                        </h1>
                    </div>
                    <div className="flex flex-row pt-4 justify-between w-full">
                        <div>
                            <p className="font-semibold text-gray-700">Start:</p>
                            <p className="font-semibold">{project.startDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">End:</p>
                            <p className="font-semibold">{project.endDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

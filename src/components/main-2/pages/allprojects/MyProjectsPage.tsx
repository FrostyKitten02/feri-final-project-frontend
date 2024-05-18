import { useEffect, useState } from "react";
import AddNewProjectPage from "./modal/AddNewProjectModal";
import { motion } from "framer-motion";
import Pagination from "./pagination/Pagination";
// toast functions import
import { toastError } from "../../../toastModals/ToastFunctions";
import {
  ProjectControllerApi,
  PageInfoRequest,
  ProjectSortInfoRequest,
  ListProjectResponse,
} from "../../../../../temp_ts/api";
import { RawAxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import RequestUtil from "../../../../util/RequestUtil";

export default function MyProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ListProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [lastPage, setLastPage] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0); // last page and total page tracking

  // states needed for pagination and sorting
  const [pageNumber, setPageNumber] = useState<number>(1);

  // const [ascending, setAscending] = useState<boolean>(true);
  //const [fields, setFields] = useState<string[]>(["CREATED_AT"]); ////// TO DO: implement sorting //////

  const api = new ProjectControllerApi(RequestUtil.API_CONFIG);

  const [cookies] = useCookies(["__session"]);

  useEffect(() => {
    setIsLoading(true);
    fetchProjects(pageNumber /*, ascending, fields*/)
      .then(() => setIsLoading(false))
      .catch((error) => {
        setIsLoading(false);
        toastError(error);
      });
  }, [pageNumber]);

  // framer motion modal states and functions
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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

  const requestArgs: RawAxiosRequestConfig =
    RequestUtil.createBaseAxiosRequestConfig(cookies.__session);

  const fetchProjects = async (
    pageNum: number
    // ascending: boolean,
    // fields: string[]
  ): Promise<void> => {
    // dynamically set pageNumber
    const pageInfo: PageInfoRequest = {
      elementsPerPage: 8,
      pageNumber: pageNum,
    };

    try {
      const response = await api.listProjects(
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
    <div>
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
      <div className="flex flex-col pt-12 px-8 border-2 border-solid rounded-2xl border-gray-200">
        <div className="flex flex-row">
          <h1 className="flex justify-start items-center w-2/3 font-bold text-2xl">
            Overview
          </h1>
          <div className="flex w-1/3 justify-end">
            <motion.button onClick={() => (modalOpen ? close() : open())}>
              <div className="flex justify-center items-center bg-rose-500 text-white rounded-lg h-12 space-x-4 w-52">
                <p className="font-semibold text-2xl">+</p>
                <p className="font-semibold text-lg">Add new project</p>
              </div>
            </motion.button>
          </div>
        </div>
        <div className="flex flex-col py-12">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center font-bold text-3xl">
              <h1>Loading projects...</h1>
            </div>
          ) : projects && projects.projects && projects.projects.length > 0 ? (
            <div className="grid grid-cols-4 gap-x-12 gap-y-12">
              {projects.projects.map((project) => (
                <div
                  key={project.id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/project-details/${project.id}`, {
                      state: {
                        startDate: project.startDate,
                        endDate: project.endDate,
                      },
                    })
                  } // navigate to project details page and pass project id as a parameter and startDate and endDate into state to use in form validation in project-details
                >
                  <motion.div className="flex flex-col bg-white justify-center px-10 h-36 rounded-xl border border-gray-200 border-solid shadow-xl box">
                    <div className="border-l-4 border-solid border-rose-500">
                      <div className="flex bg-rose-200 w-fit px-2 rounded-lg ml-2 justify-start items-center">
                        <p className="font-semibold italic text-gray-700 text-sm">
                          ID: {project.id?.slice(0, 8)}...
                          {project.id?.slice(-4)}
                        </p>
                      </div>
                      <h1 className="font-bold pl-4 text-xl">
                        {project.title}
                      </h1>
                    </div>
                    <div className="flex flex-row pt-4">
                      <div className="w-1/2">
                        <p className="font-semibold text-gray-700">Start:</p>
                        <p className="font-semibold">{project.startDate}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="font-semibold text-gray-700">End:</p>
                        <p className="font-semibold">{project.endDate}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center font-bold text-3xl space-y-4">
              <h1>No projects found...</h1>
              <p className="text-base text-gray-700">
                Click the "Add new project" button to create a new project.
              </p>
            </div>
          )}
        </div>
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
    </div>
  );
}

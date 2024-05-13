import { useState } from "react";
import { useEffect } from "react";
import AddNewProjectPage from "./modal/AddNewProjectModal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";

import RightChevron from "../../assets/all-projects/right-chevron-svgrepo-com.svg?react";
import LeftChevron from "../../assets/all-projects/left-chevron-svgrepo-com.svg?react";

// toast functions import
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../toastModals/ToastFunctions";

import {
  ProjectControllerApi,
  PageInfoRequest,
  ProjectSortInfoRequest,
  ProjectListSearchParams,
  ListProjectResponse,
} from "../../../temp_ts/api";
import { RawAxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<ListProjectResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // last page and pageNumber state tracking
  const [lastPage, setLastPage] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // generated client api for project
  const api = new ProjectControllerApi();

  const [cookies] = useCookies(["__session"]);

  // framer motion modal states and functions
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const close = () => {
    setModalOpen(false);
  };

  const open = () => {
    setModalOpen(true);
  };

  // retrieve project list
  // next and previous page functions
  const nextPage = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    fetchProjects(newPageNumber);
  };

  const prevPage = () => {
    const newPageNumber = pageNumber > 1 ? pageNumber - 1 : 1;
    setPageNumber(newPageNumber);
    fetchProjects(newPageNumber);
  };

  // request parameters
  const sortInfo: ProjectSortInfoRequest = {
    ascending: true,
    fields: ["CREATED_AT"],
  };

  const requestArgs: RawAxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${cookies.__session}`,
    },
  };

  // fetch projects on initial render and set the loading state
  useEffect(() => {
    try {
      setIsLoading(true);
      fetchProjects(pageNumber)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } catch (error: any) {
      toastError(error);
    }
  }, [pageNumber]);

  // fetch projects
  const fetchProjects = async (pageNum: number) => {
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
      if (response.data.projects) {
        setProjects(response.data);
        console.log(response.data);
        if (response.data.pageInfo?.lastPage === true) {
          setLastPage(true);
        } else {
          setLastPage(false);
        }
      }
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
            handleAddProject={() => fetchProjects(pageNumber)}
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
          {isLoading ? ( // project fetch check (this ensures that projects are either fetched or not fetched before continuing the checks)
            <div className="flex flex-col justify-center items-center font-bold text-3xl">
              <h1>Loading projects...</h1>
            </div>
          ) : projects && projects.projects && projects.projects.length > 0 ? ( // check if project length is > 0; if it is map projects in a grid
            <div className="grid grid-cols-4 gap-x-12 gap-y-12">
              {projects.projects.map((project) => (
                <Link to={""}>
                  <motion.div
                    key={project.id}
                    className="flex flex-col bg-white justify-center px-10 h-36 rounded-xl border border-gray-200 border-solid shadow-xl box"
                  >
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
                </Link>
              ))}
            </div>
          ) : (
            // if no projects are found for the user in the database, display this message
            <div className="flex flex-col justify-center items-center font-bold text-3xl space-y-4">
              <h1>No projects found...</h1>
              <p className="text-base text-gray-700">
                Click the "Add new project" button to create a new project.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-row pb-12">
          <div className="flex w-1/3 justify-start font-semibold">
            {pageNumber !== 1 && (
              <button onClick={prevPage}>
                <div className="flex flex-row">
                  <LeftChevron className="size-6 fill-gray-700" />
                  <p>Previous page</p>
                </div>
              </button>
            )}
          </div>
          <div className="flex w-1/3 justify-center">
            <p className="font-semibold text-gray-700">Page {pageNumber}</p>
          </div>
          <div className="flex w-1/3 justify-end font-semibold">
            {!lastPage && (
              <div>
                <button onClick={nextPage}>
                  <div className="flex flex-row">
                    <p>Next page</p>
                    <RightChevron className="size-6 fill-gray-700" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { RawAxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../../toastModals/ToastFunctions";
import CloseIcon from "../../../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import { CreateProjectRequest } from "../../../../../../temp_ts/api";
import RequestUtil from "../../../../../util/RequestUtil";
import { projectAPI } from "../../../../../util/ApiDeclarations";

interface AddNewProjectModalProps {
  handleClose: () => void;
  handleAddProject: () => void;
}

const validateForm = (
  title: string,
  startDate: string,
  endDate: string
): boolean => {
  if (title === "" || startDate === "" || endDate === "") {
    toastWarning("Please fill in all fields!");
    return false;
  } else if (startDate > endDate) {
    toastWarning("End date cannot be before start date!");
    return false;
  }
  return true;
};

export default function AddNewProjectPage({
  handleClose,
  handleAddProject,
}: AddNewProjectModalProps) {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // variables to get session and cookies
  // const session = useSession();
  const [cookies] = useCookies(["__session"]);
  
  // form submit function
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // validation call
    if (!validateForm(title, startDate, endDate)) return; // return if validation fails

    // project object
    const project: CreateProjectRequest = {
      title,
      startDate,
      endDate,
    };

    // authorization header
    const requestArgs: RawAxiosRequestConfig =
      RequestUtil.createBaseAxiosRequestConfig(cookies.__session);

    try {
      const response = await projectAPI.createProject(project, requestArgs);
      if (response.status === 201) {
        // if status is 201, close modal, refetch projects for page and show success toast
        handleClose();
        handleAddProject();
        toastSuccess(
          `Project with id ${response.data.id} was successfully created!`
        );
      }
      console.log(response);
    } catch (error: any) {
      console.error(error);
      toastError(`An error has occured: ${error.message}`);
    }
  };

  //framer motion
  const dropIn = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        className="w-1/2"
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col bg-white rounded-2xl border-solid border-2 border-gray-200">
          <div className="flex flex-row px-8 pt-8 pb-12">
            <div className="flex w-1/2 jutify-start">
              <h1 className="text-black font-semibold text-xl">
                Add new project
              </h1>
            </div>
            <div className="flex w-1/2 justify-end">
              <CloseIcon
                onClick={handleClose}
                className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
              />
            </div>
          </div>
          <div className="px-16 pb-16">
            <form action="post" className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-lg">
                  Title
                </label>
                <input
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-row w-1/2 space-x-8">
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 font-semibold text-lg">
                    Start date
                  </label>
                  <input
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    type="date"
                    name="startdate"
                    id="startdate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 font-semibold text-lg">
                    End date
                  </label>
                  <input
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    type="date"
                    name="enddate"
                    id="enddate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                  type="submit"
                >
                  Add project
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
}

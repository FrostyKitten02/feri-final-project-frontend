import { useState } from "react";
import { useSession } from "@clerk/clerk-react";
import axios, { RawAxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";

import {
  ProjectControllerApi,
  CreateProjectRequest,
} from "../../../../temp_ts/api";
import { RequestArgs } from "../../../../temp_ts/base";

interface AddNewProjectPageProps {
  handleClose: () => void;
}

export default function AddNewProjectPage({
  handleClose,
}: AddNewProjectPageProps) {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // variables to get session and cookies
  const session = useSession();
  const [cookies] = useCookies(["__session"]);

  // generated client api for project
  const api = new ProjectControllerApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // project object
    const project: CreateProjectRequest = {
      title,
      startDate,
      endDate,
    };

    // authorization header
    const requestArgs: RawAxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${cookies.__session}`,
      },
    };

    try {
      const response = await api.createProject(project, requestArgs);
      console.log(response);
    } catch (error) {
      console.error(error);
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
          <h1 className="text-black px-16 pt-20 pb-5 font-semibold text-xl">
            Add new project
          </h1>
          <div className="px-16 pb-20">
            <form action="post" className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-gray-700 font-bold text-lg">Title</label>
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
                  <label className="text-gray-700 font-bold text-lg">
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
                  <label className="text-gray-700 font-bold text-lg">
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

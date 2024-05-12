import { useState } from "react";
import { useEffect } from "react";
import AddNewProjectPage from "./modal/AddNewProjectPage";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";

function getMockProject(): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "Mock Project 1",
          ownerId: "mock-owner-id-1",
          startDate: "2022-01-01",
          endDate: "2022-12-31",
        },
        {
          id: "2",
          title: "Mock Project 2",
          ownerId: "mock-owner-id-1",
          startDate: "2022-01-01",
          endDate: "2022-12-31",
        },
        {
          id: "3",
          title: "Mock Project 3",
          ownerId: "mock-owner-id-1",
          startDate: "2022-01-01",
          endDate: "2022-12-31",
        },
        {
          id: "4",
          title: "Mock Project 4",
          ownerId: "mock-owner-id-1",
          startDate: "2022-01-01",
          endDate: "2022-12-31",
        },
        {
          id: "5",
          title: "Mock Project 5",
          ownerId: "mock-owner-id-1",
          startDate: "2022-01-01",
          endDate: "2022-12-31",
        },
        {
          id: "6",
          title: "Mock Project 6",
          ownerId: "mock-owner-id-1",
          startDate: "2022-01-01",
          endDate: "2022-12-31",
        },
      ]);
    }, 1000); // Delay of 1 second
  });
}

interface Project {
  id: string;
  title: string;
  ownerId: string;
  startDate: string;
  endDate: string;
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  // framer motion modal states and functions
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const close = () => {
    setModalOpen(false);
  };

  const open = () => {
    setModalOpen(true);
  };

  // mock projects
  useEffect(() => {
    getMockProject().then((projects: Project[]) => setProjects(projects));
  }, []);

  if (!projects.length) {
    return (
      <div className="flex justify-center items-center pt-60 font-bold text-3xl">
        Loading projects...
      </div>
    );
  }

  return (
    <div>
      <div>{modalOpen && <AddNewProjectPage handleClose={close} />}</div>
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
          <div className="grid grid-cols-4 gap-x-12 gap-y-12">
            {projects.map((project) => (
              <Link to={""}>
                <motion.div
                  key={project.id}
                  className="flex flex-col bg-white justify-center px-10 h-36 rounded-xl border border-gray-200 border-solid shadow-xl box"
                >
                  <div className="border-l-4 border-solid border-rose-500">
                    <div className="flex bg-rose-200 w-fit px-2 rounded-lg ml-2 justify-center items-center">
                      <p className="font-semibold italic text-gray-700 text-sm">
                        ID: {project.id}
                      </p>
                    </div>
                    <h1 className="font-bold pl-4 text-xl">{project.title}</h1>
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
        </div>
      </div>
    </div>
  );
}

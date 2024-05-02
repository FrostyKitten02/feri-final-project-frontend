import { useState } from "react";
import { useEffect } from "react";
import AddNewProjectPage from "./AddNewProjectPage";
import { Link } from "react-router-dom";

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
    <div className="flex flex-col px-20 py-20">
      <div>
        <h1 className="font-bold text-3xl">My Projects</h1>
      </div>
      <div className="flex flex-col py-20">
        <div className="w-1/6">
          <Link to="/projects-overview/add-new-project">
            <div className="flex justify-center items-center bg-[#0E1428]/40 text-white shadow-lg rounded-lg mb-20 h-20 space-x-6">
              <p className="font-semibold text-3xl">+</p>
              <p className="font-semibold text-xl">Add new project</p>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-10 w-full">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col bg-white/30 justify-center px-10 h-32 rounded-lg border border-gray-300 shadow-lg"
            >
              <h1 className="font-semibold">{project.title}</h1>
              <p>Start: {project.startDate}</p>
              <p>End: {project.endDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

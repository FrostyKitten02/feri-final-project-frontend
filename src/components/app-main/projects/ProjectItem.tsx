import { useNavigate } from "react-router-dom";
import TextUtil from "../../../util/TextUtil";
import SessionUtil from "../../../util/SessionUtil";
import { HiCalendar } from "react-icons/hi";
import { FC } from "react";
import { ProjectItemProps } from "../../../interfaces";
import { useAuth } from "@clerk/clerk-react";
import { ProgressCircle } from "@tremor/react";
import { IoPeopleOutline } from "react-icons/io5";
import { LuPackage } from "react-icons/lu";
import { ProjectModal } from "./ProjectModal";

export const ProjectItem: FC<ProjectItemProps> = ({
  project,
  handleEditProject,
}) => {
  const navigate = useNavigate();
  const progress: number = TextUtil.returnProgress(
    project?.startDate,
    project?.endDate
  );
  const { text, color } = TextUtil.returnProgressText(progress);
  const { userId } = useAuth();
  const handleNavigate = () => {
    navigate(`/project/${project?.id}/project-dashboard`);
    SessionUtil.setSidebarSelect("project dashboard");
  };

  return (
    project && (
      <div className="p-5 h-72 w-[450px]">
        <div className="flex flex-col w-full h-full hover:bg-gray-100 transition delay-50 border border-gray-200 border-solid rounded-xl">
          <button
            className="w-full h-full rounded-xl"
            onClick={() => handleNavigate()}
          >
            <div className="flex flex-col w-full h-full">
              <div className="flex px-4 pt-4 pb-2 flex-row items-center">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                  <HiCalendar className="h-4 w-4 fill-primary" />
                </div>
                <div className="pl-2 text-xs text-muted">
                  {TextUtil.refactorDate(project.startDate)}
                </div>
                <div className="flex-grow mx-2 h-[1px] bg-gray-200" />
                <div className="pr-2 text-xs text-muted">
                  {TextUtil.refactorDate(project.endDate)}
                </div>
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                  <HiCalendar className="h-4 w-4 fill-primary" />
                </div>
              </div>
              <div className="flex flex-row flex-grow">
                <div className="flex pl-6 pr-4 flex-col justify-center items-center">
                  <ProgressCircle
                    className="flex-grow z-0"
                    value={progress}
                    size={"lg"}
                    strokeWidth={8}
                    showAnimation={true}
                  >
                    <span className="text-lg flex items-center justify-center font-mono tracking-wide font-bold">
                      {progress.toFixed(0)}
                    </span>
                    <span className="text-sm font-bold flex justify-center items-center">
                      %
                    </span>
                  </ProgressCircle>
                </div>
                <div className="flex flex-grow justify-center items-center text-xl uppercase font-bold pr-6">
                  {TextUtil.truncateString(project.title, 60)}
                </div>
              </div>
            </div>
          </button>
          <div className="flex flex-col">
            <div className="flex-grow mx-2 h-[1px] bg-gray-200" />
            <div className="flex flex-row justify-between">
              <div className="pl-4 flex flex-row space-x-3">
                <div className="flex flex-row items-center">
                  <LuPackage size="22" />
                  <span className="pl-1 text-lg font-mono">
                    {project.workPackageCount}
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <IoPeopleOutline size="22" />
                  <span className="pl-1 text-lg font-mono">
                    {project.peopleCount}
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 flex flex-row items-center space-x-2 justify-end">
                <div className="flex bg-blue-200 w-fit px-2 rounded-lg justify-start items-center">
                  <p className="font-semibold italic text-sm uppercase">
                    {project.ownerId === userId ? "owned" : "assigned"}
                  </p>
                </div>
                <div
                  className={`flex ${color} w-fit px-2 rounded-lg  justify-start items-center`}
                >
                  <p className="font-semibold italic text-sm uppercase">
                    {text}
                    {project.workPackages?.length}
                  </p>
                </div>
                <div className="flex flex-row items-center">
                  <ProjectModal
                      edit={true}
                      handleProjectSubmit={handleEditProject}
                      projectId={project.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

import { useParams } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../toastModals/ToastFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  ProjectControllerApi,
  ProjectDto,
  GetProjectResponse,
} from "../../../../temp_ts/api";
import { RawAxiosRequestConfig } from "axios";

export default function DashboardPage() {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState<ProjectDto>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const api = new ProjectControllerApi();
  const [cookies] = useCookies(["__session"]);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    const requestArgs: RawAxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${cookies.__session}`,
      },
    };

    try {
      if (projectId) {
        const response = await api.getProject(projectId, requestArgs);
        if (response.status === 200 && response.data) {
          setProjectDetails(response.data.projectDto);
        } else {
          toastError("Project details not found");
        }
      } else {
        toastError("Project id not found");
      }
    } catch (error: any) {
      toastError(error);
    }
  };

  return (
    <div className="flex w-screen h-full">
      <div className="flex flex-col h-full px-20 py-20 w-full">
        <h1 className="flex justify-start items-center font-bold text-3xl py-6">
          Dashboard
        </h1>
        <div className="flex flex-col py-12 px-12 border-2 border-solid rounded-2xl border-gray-200 w-full h-full">
          <div className="flex justify-end">
            <p className="text-gray-700 italic pb-6 text-sm">{projectDetails?.id}</p>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row items-center space-x-4">
              <h1 className="font-semibold text-3xl">
                {projectDetails?.title}
              </h1>
            </div>
            {projectDetails?.endDate && (
              <div className="flex flex-row items-center space-x-4">
                <h1 className="font-semibold text-lg">Deadline:</h1>
                <p className="text-lg font-semibold">
                  {format(parseISO(projectDetails.endDate), "MMMM do, yyyy")}
                </p>
              </div>
            )}
            <div>
                <h1 className="font-semibold text-lg">Assignees:</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import "react-loading-skeleton/dist/skeleton.css";
import { GetPeopleResponse, ProjectDto } from "../../../temp_ts";
import { projectAPI } from "../../util/ApiDeclarations";
import { toastError } from "../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../util/CustomHooks";
import PlusIcon from "../../assets/icons/plus-large-svgrepo-com.svg?react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState<ProjectDto>();
  const [assignees, setAssignees] = useState<GetPeopleResponse>();
  //const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    fetchPeopleOnProject();
  }, [projectId]);

  const requestArgs = useRequestArgs();

  const fetchProjectDetails = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200 && response.data) {
          setProjectDetails(response.data.projectDto);
          console.log(response.data);
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

  const fetchPeopleOnProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getPeopleOnProjectByProjectId(
          projectId,
          requestArgs
        );
        if (response.status === 200) {
          setAssignees(response.data);
        }
      } else {
        toastError("Project id not found.");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full px-12 py-6 w-full">
        <div className="flex flex-col py-12 px-12 border-2 border-solid rounded-2xl border-gray-200 w-full h-full">
          <div className="flex flex-col space-y-6 w-1/2 pb-6">
            <div className="flex flex-row items-center space-x-4">
              <h1 className="font-semibold text-3xl">
                {projectDetails?.title}
              </h1>
            </div>
            {projectDetails?.endDate && (
              <div className="flex flex-row items-center space-x-4">
                <h1 className="font-semibold text-xl">Deadline:</h1>
                <p className="text-lg font-semibold">
                  {format(parseISO(projectDetails.endDate), "MMMM do, yyyy")}
                </p>
              </div>
            )}
            <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-2">
              <h1 className="font-semibold text-xl">Assignees:</h1>
              {assignees?.people?.length !== 0 ? (
                assignees?.people?.map((assignee) => (
                  <div className="text-md" key={assignee.id}>
                    {assignee.name && assignee.lastname ? (
                      <p>
                        {assignee.name} {assignee.lastname}
                      </p>
                    ) : (
                      <p>{assignee.email} </p>
                    )}
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-gray-700 italic font-semibold">
                    There's no one assigned to this project. Navigate the team
                    page to assign people.
                  </p>
                </div>
              )}
              <div className="flex rounded-full border border-dashed justify-center items-center text-lg w-8 h-8 cursor-pointer bg-[#1A426B]/30 border-[#1A426B]">
                <PlusIcon
                  className="w-4 h-4 stroke-[#1A426B]"
                  onClick={() => navigate(`../team`)}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full">
            
          </div>
        </div>
      </div>
    </div>
  );
}

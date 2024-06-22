import { useEffect, useState } from "react";
import { PersonDto } from "../../../../temp_ts";
import TeamModal from "./TeamModal";
import { useParams } from "react-router-dom";
import { toastError } from "../../toast-modals/ToastFunctions";
import { projectAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { BsPersonDash } from "react-icons/bs";

export default function ProjectTeamPage() {
  const [peopleOnProject, setPeopleOnProject] = useState<PersonDto[]>([]);
  const { projectId } = useParams();
  const requestArgs = useRequestArgs();

  useEffect(() => {
    fetchPeopleOnProject();
  }, [projectId]);

  const fetchPeopleOnProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getPeopleOnProjectByProjectId(
          projectId,
          requestArgs
        );
        if (response.status === 200) {
          if (response.data.people) setPeopleOnProject(response.data.people);
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
      <div className="flex flex-row h-full flex-grow">
        <div
          className={`flex flex-col border-r-2 border-solid border-gray-200 w-full h-full`}
        >
          <div className="flex flex-row items-center p-10 text-2xl font-semibold border-b border-solid border-gray-200">
            <p>Employee list</p>
          </div>
          <div className="w-full h-full px-12 bg-gray-200 rounded-bl-[20px]">
            <div className="grid grid-cols-3 pt-8 pb-4">
              <div className="flex justify-center items-center gap-x-4">
                <div className="text-sm text-gray-600 font-semibold">NAME</div>
              </div>
              <div className="flex justify-center items-center gap-x-4">
                <div className="text-sm text-gray-600 font-semibold">
                  EMAIL ADDRESS
                </div>
              </div>
              <div></div>
            </div>
            <div className="rounded-2xl border border-solid border-gray-200 overflow-hidden bg-white shadow-md divide-y divide-solid divide-gray-200">
              {peopleOnProject?.map((person) => (
                <div
                  className="grid grid-cols-3 py-6 hover:bg-gray-100 transition delay-50"
                  key={person.id}
                >
                  <div className="flex items-center justify-center text-sm font-semibold">
                    <div>
                      {person.name} {person.lastname}
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-sm font-normal text-gray-500">
                    {person.email}
                  </div>
                  <div className="flex items-center justify-center">
                    <button>
                      <BsPersonDash className="size-6 fill-gray-500 hover:fill-red-500 transition delay-50" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex px-6 items-start pt-6">
          <TeamModal handleAddPerson={fetchPeopleOnProject} />
        </div>
      </div>
    </div>
  );
}

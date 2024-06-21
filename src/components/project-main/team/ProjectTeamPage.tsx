import { useEffect, useState } from "react";
import { PersonDto } from "../../../../temp_ts";
import TeamModal from "./TeamModal";
import { useParams } from "react-router-dom";
import { toastError } from "../../toast-modals/ToastFunctions";
import { projectAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { BsPersonDash } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi2";

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
          <div className="flex flex-row items-center p-10 text-xl font-semibold gap-x-4">
            <HiOutlineUserGroup className="stroke-black size-8" />
            <p>Employee list</p>
          </div>
          <div className="w-full h-full">
            <div className="grid grid-cols-3 border-b-2 border-solid border-gray-200 py-6">
              <div className="flex justify-center items-center gap-x-4">
                <div className="text-sm text-gray-500 font-semibold">Name</div>
              </div>
              <div className="flex justify-center items-center gap-x-4">
                <div className="text-sm text-gray-500 font-semibold">Email</div>
              </div>
              <div></div>
            </div>
            {peopleOnProject?.map((person) => (
              <div
                className="grid grid-cols-3 border-b-2 border-solid border-gray-200 py-6 hover:bg-gray-200 transition delay-50"
                key={person.id}
              >
                <div className="flex items-center justify-center text-md font-semibold">
                  {person.name} {person.lastname}
                </div>
                <div className="flex items-center justify-center text-md font-semibold">
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
        <div className="flex px-6 items-start pt-6">
          <TeamModal handleAddPerson={fetchPeopleOnProject} />
        </div>
      </div>
    </div>
  );
}

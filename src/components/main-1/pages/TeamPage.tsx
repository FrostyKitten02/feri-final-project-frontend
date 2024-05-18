import { motion } from "framer-motion";
import { useState } from "react";
import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toastError, toastSuccess } from "../../toastModals/ToastFunctions";
import { useEffect } from "react";
import CloseIcon from "../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import PersonIcon from "../../../assets/team-page/person-svgrepo-com.svg?react";
import EmailIcon from "../../../assets/team-page/email-svgrepo-com.svg?react";
import CogIcon from "../../../assets/team-page/cog-svgrepo-com.svg?react";
import {
  AddPersonToProjectRequest,
  GetPeopleResponse,
} from "../../../../temp_ts/api";
import { RawAxiosRequestConfig } from "axios";
import RequestUtil from "../../../util/RequestUtil";
import { projectAPI } from "../../../util/ApiDeclarations";

// mock list
const employeelist = [
  { name: "Alen Fridau", id: "003fe51c-bd83-410c-86e7-615c424174d2" },
  { name: "Alen Fridau 2.0", id: "e9164ca9-b019-46de-a76d-5b67b5e1307f" },
  { name: "Luka Moleh", id: "bb332249-77e7-41e5-add4-bce5bce26f80" },
];

export default function TeamPage() {
  const { projectId } = useParams(); // get the project id from the url
  const [cookies] = useCookies(["__session"]);

  // form states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false); // dropdown state
  const [selectedEmployee, setSelectedEmployee] = useState<any>("");
  const [searchValue, setSearchValue] = useState("");

  const [peopleOnProject, setPeopleOnProject] = useState<GetPeopleResponse>();

  const requestArgs: RawAxiosRequestConfig =
    RequestUtil.createBaseAxiosRequestConfig(cookies.__session);

  useEffect(() => {
    fetchPeopleOnProject();
  }, [projectId]);

  // search function for the dropdown
  const matches = useMemo(() => {
    return matchSorter(employeelist, searchValue)
      .slice(0, 4) // limit the number of shown matches
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchValue]);

  const addPersonToProject = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const personObject: AddPersonToProjectRequest = {
      personId: selectedEmployee.id,
    };

    try {
      if (projectId) {
        const response = await projectAPI.addPersonToProject(
          projectId,
          personObject,
          requestArgs
        );
        if (response.status === 201) {
          toastSuccess(
            selectedEmployee.name + " was successfully added to the project!"
          );
          fetchPeopleOnProject();
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
        if ((response.status = 200)) {
          setPeopleOnProject(response.data);
        } else {
          toastError("There's been an error retreiving employees.");
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
        <div className="flex flex-row py-6">
          <div className="flex justify-start w-2/3 items-center">
            <h1 className="font-bold text-3xl">Manage team</h1>
          </div>
          <div className="flex w-1/3 justify-end items-center">
            <button onClick={() => setIsFormOpen(true)}>
              <div className="flex justify-center items-center bg-rose-500 text-white rounded-lg h-12 space-x-4 w-52">
                <p className="font-semibold text-2xl">+</p>
                <p className="font-semibold text-lg">Assign person</p>
              </div>
            </button>
          </div>
        </div>
        <motion.div
          className="flex justify-end"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isFormOpen ? "auto" : 0,
            opacity: isFormOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            delay: 0.2,
            type: "tween",
          }}
        >
          <div className="flex-row pb-6 w-1/3 border-2 border-solid rounded-lg border-gray-200 px-6 py-6">
            <form action="post" onSubmit={addPersonToProject}>
              <div className="flex justify-end">
                <CloseIcon
                  onClick={() => setIsFormOpen(false)}
                  className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
                />
              </div>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-row">
                  <div className="flex flex-col w-full">
                    <div className="pb-2 space-y-2">
                      <label className="text-gray-700 font-semibold text-lg">
                        Employee
                      </label>
                      <p className="text-sm text-gray-700 italic">
                        Note: only available employees are listed.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select employee"
                        value={selectedEmployee.name}
                        onClick={() => setIsOpen(!isOpen)}
                        readOnly
                        className="cursor-pointer px-4 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200 rounded-md py-2"
                      />
                      {isOpen && (
                        <div className="absolute z-10 mt-1 backdrop-blur-xl">
                          <input
                            className="px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            type="text"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                          <div className="border border-solid border-gray-200 overflow-auto max-h-60">
                            {matches.map((employee) => (
                              <div
                                key={employee.id}
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setIsOpen(false);
                                }}
                                className="cursor-pointer hover:bg-gray-200 px-4 py-2 border-b border-solid border-gray-300"
                              >
                                {employee.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className="px-4 py-2 bg-rose-500 text-white rounded-md"
                    type="submit"
                  >
                    Assign to project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
        <div
          className={`flex flex-col border-2 border-solid rounded-2xl border-gray-200 w-full h-full mt-6 ${
            isFormOpen ? "" : "z-10"
          }`}
        >
          <div className="flex flex-col">
            <div></div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center border-b-2 border-gray-200 border-solid py-6 px-4">
                <div className="flex flex-row space-x-2 w-1/3 items-center justify-center">
                  <PersonIcon className="size-6 fill-gray-500" />
                  <h1 className="text-md font-semibold text-gray-500">Name</h1>
                </div>
                <div className="flex flex-row space-x-2 w-1/3 items-center justify-center">
                  <EmailIcon className="size-5 fill-gray-500" />
                  <h1 className="text-md font-semibold text-gray-500">Email</h1>
                </div>
                <div className="flex flex-row space-x-2 w-1/3 items-center justify-center">
                  <CogIcon className="size-6 fill-gray-500" />
                  <h1 className="text-md font-semibold text-gray-500">
                    Manage
                  </h1>
                </div>
              </div>
              {peopleOnProject &&
              peopleOnProject.people &&
              peopleOnProject.people.length > 0 ? (
                peopleOnProject.people.map((p) => {
                  return (
                    <div
                      className="flex flex-row items-center py-6 px-4 border-gray-200 border-b border-solid"
                      key={p.email}
                    >
                      <div className="flex flex-row space-x-2 w-1/3 items-center justify-center">
                        {p.name && p.lastname ? (
                          <div className="flex flex-row text-md font-semibold space-x-1">
                            <p>{p.name}</p>
                            <p>{p.lastname}</p>
                          </div>
                        ) : (
                          <div className="text-gray-500 italic font-normal">
                            <p>No name provided</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row space-x-2 w-1/3 items-center justify-center">
                        <h1 className="text-md font-semibold ">{p.email}</h1>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-row items-center py-6 px-4"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

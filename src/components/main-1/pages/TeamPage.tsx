import { motion } from "framer-motion";
import { useState } from "react";
import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {toastError, toastSuccess } from "../../toastModals/ToastFunctions";

import CloseIcon from "../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import { AddPersonToProjectRequest, ProjectControllerApi } from "../../../../temp_ts/api";
import { RawAxiosRequestConfig } from "axios";

const employeelist = [
  { name: "Alen Fridau", id: "003fe51c-bd83-410c-86e7-615c424174d2" },
  { name: "John Doe", id: "003fe51c-bd83-410c-86e7-615c426174d2" },
  { name: "Jane Doe", id: "003fe51c-bd83-410c-86e7-615c421174d2" },
];

export default function TeamPage() {
  const api = new ProjectControllerApi();
  const { projectId } = useParams();
  const [cookies] = useCookies(["__session"]);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false); // dropdown state
  const [selectedEmployee, setSelectedEmployee] = useState<any>("");

  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    return matchSorter(employeelist, searchValue)
      .slice(0, 4) // limit the number of shown matches
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchValue]);

  const addPersonToProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const personObject: AddPersonToProjectRequest = {
      personId: selectedEmployee.id,
    };

    const requestArgs: RawAxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${cookies.__session}`,
      },
    };

    try {
      if (projectId) {
        const response = await api.addPersonToProject(projectId, personObject, requestArgs);
        if (response.status === 201) {
          console.log(response.data);
          toastSuccess(selectedEmployee.name + " was successfully added to the project!");
        }
      } else {
        toastError("Project id not found");
      }
    } catch (error: any) {
      toastError(error);
    }
  }

  return (
    <div className="flex w-screen h-full">
      <div className="flex flex-col h-full px-20 py-20 w-full">
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
            duration: 0.2,
            ease: "easeInOut",
            delay: 0.2,
            type: "tween",
          }}
        >
          <div className="flex-row pb-6 w-1/2 border-2 border-solid rounded-lg border-gray-200 px-6 py-6">
            <form action="post" onSubmit={addPersonToProject}>
              <div className="flex justify-end">
                <CloseIcon
                  onClick={() => setIsFormOpen(false)}
                  className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
                />
              </div>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-row">
                  <div className="flex flex-col w-1/2">
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
                  <div className="flex flex-col w-1/2">
                    <div className="pb-2">
                      <label className="text-gray-700 font-semibold text-lg">
                        Type
                      </label>
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
        <div className="flex flex-col py-12 px-12 border-2 border-solid rounded-2xl border-gray-200 w-full h-full mt-6">
          <h1>Employee list</h1>
        </div>
      </div>
    </div>
  );
}

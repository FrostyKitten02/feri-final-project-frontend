import { projectAPI, taskAPI } from "../../../util/ApiDeclarations";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { AssignPersonFormFields } from "../../../types/forms/formTypes";
import { useRequestArgs } from "../../../util/CustomHooks";
import { AssignPersonModalProps } from "../../../interfaces";
import Backdrop from "../../template/modal/Backdrop";
import { toastSuccess, toastError } from "../../toast-modals/ToastFunctions";
import { AddPersonToTaskRequest, PersonDto } from "../../../../temp_ts";
import { useEffect, useMemo, useState } from "react";
import CloseIcon from "../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import { motion } from "framer-motion";
import { matchSorter } from "match-sorter";

export default function AssignPersonModalForm({
  handleClose,
  taskId,
  taskTitle
}: AssignPersonModalProps) {
  const { projectId } = useParams();
  const requestArgs = useRequestArgs();
  const [peopleOnProject, setPeopleOnProject] = useState<PersonDto[]>();
  const [searchValue, setSearchValue] = useState("");
  const [personId, setPersonId] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false); // dropdown state for search

  useEffect(() => {
    fetchPeopleOnProject();
  }, []);

  const matches = useMemo(() => {
    if (searchValue) {
      if (peopleOnProject)
        return matchSorter(peopleOnProject, searchValue, {
          keys: ["email", "name"],
        }).slice(
          // use email and name when searching
          0,
          4
        );
    } else {
      if (peopleOnProject) return peopleOnProject.slice(0, 4);
    }
  }, [searchValue]);

  
  const { 
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignPersonFormFields>(); // react hook form
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  const fetchPeopleOnProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getPeopleOnProjectByProjectId(
          projectId,
          requestArgs
        );
        if ((response.status = 200)) {
          setPeopleOnProject(response.data.people);
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

  const onSubmit: SubmitHandler<AssignPersonFormFields> = async (
    data
  ): Promise<void> => {
    const personInfo: AddPersonToTaskRequest = {
      occupancy: data.occupancy / 100,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    try {
      const response = await taskAPI.assignPersonToTask(
        taskId,
        personId,
        personInfo,
        requestArgs
      );
      if (response.status === 204) {
        setPersonId("");
        handleClose();
        toastSuccess(
          "User " + personId + " was successfully assigned to the task."
        );
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

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
    <Backdrop  closeModal={handleClose}>
      <motion.div
        className="w-fit z-20"
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col bg-white rounded-2xl border-solid border-2 border-gray-200 px-12 py-12">
          <form action="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row pb-12">
              <div className="flex w-1/2 jutify-start">
                <h1 className="text-black font-semibold text-xl">
                  Assign person to task: {taskTitle}
                </h1>
              </div>
              <div className="flex w-1/2 justify-end">
                <CloseIcon
                  onClick={handleClose}
                  className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-row">
                <div className="flex flex-col w-full space-y-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Employee
                    </label>
                    <Controller 
                      name="person"
                      control={control}
                      defaultValue={undefined} // empty field on load
                      render={({ field }) => (
                        <div className="relative flex">
                          <input
                            type="text"
                            placeholder="Select employee"
                            value={field.value && field.value.email}
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
                                onChange={(e) => {
                                  setSearchValue(e.target.value);
                                  field.onChange(e.target.value); // update the field value
                                }}
                              />
                              <div className="border border-solid border-gray-200 overflow-auto max-h-60">
                                {matches?.map((employee) => (
                                  <div
                                    key={employee.id}
                                    onClick={() => {
                                      field.onChange(employee); // update the field value
                                      setIsOpen(false);
                                      {
                                        if (employee?.id)
                                          setPersonId(employee.id); // set person id on select for request
                                      }
                                    }}
                                  >
                                    {employee.email}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex flex-row w-full space-x-8">
                    <div className="flex flex-col w-1/2 space-y-2">
                      <label className="text-gray-700 font-semibold text-lg">
                        Start date
                      </label>
                      <input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        type="date"
                        {...register("startDate", {
                          required: "Start date can not be empty!",
                          validate: (value) => {
                            if (value > watchEndDate) {
                              return "Start date must be before end date!";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.startDate && (
                        <div className="text-red-500 font-semibold">
                          {errors.startDate.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col w-1/2 space-y-2">
                      <label className="text-gray-700 font-semibold text-lg">
                        End date
                      </label>
                      <input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        type="date"
                        {...register("endDate", {
                          required: "End date can not be empty",
                          validate: (value) => {
                            if (value < watchStartDate) {
                              return "End date must be after start date!";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.endDate && (
                        <div className="text-red-500 font-semibold">
                          {errors.endDate.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Occupancy
                    </label>
                    <input
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-1/2"
                      type="number"
                      min={0}
                      max={100}
                      {...register("occupancy", {
                        required: "Occupancy can not be empty!",
                      })}
                    />

                    <p className="w-1/2 font-semibold">%</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                  type="submit"
                >
                  Confirm
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </Backdrop>
  );
}

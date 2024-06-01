import { SubmitHandler, useForm } from "react-hook-form";
import CloseIcon from "../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import { motion } from "framer-motion";
import { useState } from "react";
import { WorkPackageFormProps } from "../../../interfaces";
import { WorkPackageFormFields } from "../../../types/forms/formTypes";
import { useParams } from "react-router-dom";
import { CreateWorkPackageRequest } from "../../../../temp_ts";
import { workPackageAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import Backdrop from "../../app-main/projects/modal/Backdrop";

export default function WorkPackageForm({
  setIsFormOpen,
  handleAddWorkPackage,
  handleClose,
}: WorkPackageFormProps) {
  const { projectId } = useParams();
  const requestArgs = useRequestArgs();

  // react hook form
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkPackageFormFields>();
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  register("isRelevant", { value: false }); // register the isRelevant field here, because it's a custom component not input

  // states for framer motion relevant switch
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = (): void => {
    setIsOn(!isOn);
    setValue("isRelevant", !isOn);
  };

  const onSubmit: SubmitHandler<WorkPackageFormFields> = async (
    data
  ): Promise<void> => {
    // onSUbmit function passed to the form (react hook form)
    const workPackage: CreateWorkPackageRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      isRelevant: data.isRelevant,
      assignedPM: data.assignedPM,
      projectId: projectId,
    };

    try {
      if (projectId) {
        const response = await workPackageAPI.createWorkPackage(
          workPackage,
          requestArgs
        );
        if (response.status === 201) {
          handleAddWorkPackage();
          toastSuccess(
            "Work package " +
              data.title +
              " was successfully added to the project!"
          );
        }
      } else {
        toastError("Project id not found");
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
    <Backdrop onClick={handleClose}>
      <motion.div
        className="w-fit z-20"
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex-row pb-6 border-2 border-solid rounded-lg border-gray-200 px-6 py-6 bg-white">
          <form action="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-end">
              <CloseIcon
                onClick={() => setIsFormOpen(false)}
                className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
              />
            </div>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-row">
                <div className="flex flex-col w-full space-y-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Title
                    </label>
                    <input
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      type="text"
                      placeholder="Enter work package title"
                      {...register("title", {
                        required: "Title can not be empty!",
                      })}
                    />
                    {errors.title && (
                      <div className="text-red-500 font-semibold">
                        {errors.title.message}
                      </div>
                    )}
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
                      PM
                    </label>
                    <input
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-1/2"
                      type="number"
                      min={1}
                      {...register("assignedPM", {
                        required: "PM can not be empty",
                      })}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Relevant
                    </label>
                    <div
                      className={`flex ${
                        !isOn ? "justify-start" : "justify-end"
                      } p-1 w-10 h-6 rounded-2xl ${
                        !isOn ? "bg-gray-300" : "bg-green-600"
                      } cursor-pointer items-center`}
                      data-ison={isOn}
                      onClick={toggleSwitch}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full"
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 700,
                          damping: 30,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                  type="submit"
                >
                  Add to project
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </Backdrop>
  );
}

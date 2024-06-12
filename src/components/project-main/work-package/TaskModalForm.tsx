import { motion } from "framer-motion";
import Backdrop from "../../template/modal/Backdrop";
import { TaskModalProps } from "../../../interfaces";
import CloseIcon from "../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskFormFields } from "../../../types/forms/formTypes";
import { useState } from "react";
import { CreateTaskRequest } from "../../../../temp_ts";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import { taskAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";

export default function TaskModalForm({
  handleClose,
  handleAddTask,
  workPackageId,
  workPackageTitle,
}: TaskModalProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormFields>();
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  register("isRelevant", { value: false });

  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = (): void => {
    setIsOn(!isOn);
    setValue("isRelevant", !isOn);
  };

  const requestArgs = useRequestArgs();

  const onSubmit: SubmitHandler<TaskFormFields> = async (
    data
  ): Promise<void> => {
    const task: CreateTaskRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      isRelevant: data.isRelevant,
      workPackageId: workPackageId,
    };

    try {
      const response = await taskAPI.createTask(task, requestArgs);
      if (response.status === 201) {
        handleAddTask();
        toastSuccess("Task " + data.title + " was successfully created.");
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
    <Backdrop closeModal={handleClose}>
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
                  Add new task to: {workPackageTitle}
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
                      Title
                    </label>
                    <input
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      type="text"
                      placeholder="Enter task title"
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
              <div className="flex justify-start">
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                  type="submit"
                >
                  Add task
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </Backdrop>
  );
}

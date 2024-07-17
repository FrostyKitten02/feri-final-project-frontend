import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CreateTaskRequest, UpdateTaskRequest } from "../../../../temp_ts";
import { TaskModalProps } from "../../../interfaces";
import { TaskFormFields } from "../../../types/forms/formTypes";
import { taskAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { toastSuccess, toastError } from "../../toast-modals/ToastFunctions";
import { Label, TextInput, Datepicker } from "flowbite-react";
import { motion } from "framer-motion";
import TextUtil from "../../../util/TextUtil";
import {
  CustomModal,
  CustomModalHeader,
  ModalTitle,
  ModalText,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
} from "../../template/modal/CustomModal";
import { FaPlus } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";

export default function TaskModal({
  handleAddTask,
  workPackageId,
  workPackageTitle,
  workPackageStartDate,
  workPackageEndDate,
  disabled,
  edit,
  taskTitle,
  taskStartDate,
  taskEndDate,
  taskIsRelevant,
  taskId,
}: TaskModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const requestArgs = useRequestArgs();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormFields>();
  const watchStartDate = watch("startDate");
  register("isRelevant", { value: !edit ? true : taskIsRelevant });

  const [isOn, setIsOn] = useState(!edit ? true : taskIsRelevant);
  const toggleSwitch = (): void => {
    setIsOn(!isOn);
    setValue("isRelevant", !isOn);
  };

  const handleCloseEdit = (): void => {
    reset();
    setModalOpen(false);
  };

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
        reset();
        setModalOpen(false);
        handleAddTask();
        toastSuccess("Task " + data.title + " was successfully created.");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const onEdit: SubmitHandler<TaskFormFields> = async (data): Promise<void> => {
    const task: UpdateTaskRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      isRelevant: data.isRelevant,
    };

    try {
      if (taskId) {
        const response = await taskAPI.updateTask(taskId, task, requestArgs);
        if (response.status === 200) {
          reset();
          setModalOpen(false);
          handleAddTask();
          toastSuccess("Task " + data.title + " was successfully updated.");
        }
      } else {
        toastError("Task id not found.");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      {edit ? (
        <button onClick={() => setModalOpen(true)}>
          <FiEdit3 className="size-6 stroke-gray-700 hover:stroke-primary transition delay-50" />
        </button>
      ) : (
        <button
          disabled={disabled}
          onClick={() => setModalOpen(true)}
          className={`flex items-center justify-center ${
            disabled ? `bg-primary/30` : `bg-primary hover:bg-primary/80 transition delay-50`
          } rounded-lg text-white w-28 h-8 gap-x-2`}
        >
          <FaPlus className="stroke-white size-4" />
          <span className="text-sm">New task</span>
        </button>
      )}
      {modalOpen && (
        <CustomModal
          closeModal={!edit ? () => setModalOpen(false) : handleCloseEdit}
          modalWidth="700px"
        >
          <form
            onSubmit={!edit ? handleSubmit(onSubmit) : handleSubmit(onEdit)}
          >
            <CustomModalHeader
              handleModalOpen={
                !edit ? () => setModalOpen(false) : handleCloseEdit
              }
            >
              <ModalTitle>
                {!edit ? (
                  <span>Add a task to work package: {workPackageTitle}</span>
                ) : (
                  <span>Edit task: {taskTitle}</span>
                )}
              </ModalTitle>
              <ModalText
                showInfoIcon={true}
                showWarningIcon={false}
                contentColor="muted"
              >
                Information provided in the form can be changed later on.
              </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
              <div>
                <Label>Task title</Label>
                <TextInput
                  defaultValue={!edit ? "" : taskTitle}
                  type="text"
                  {...register("title", {
                    required: "Title can not be empty!",
                  })}
                />
                <CustomModalError error={errors.title?.message} />
              </div>
              <div className="flex flex-row justify-between pt-6">
                <div className="w-[270px]">
                  <Label>Start date</Label>
                  <ModalText
                    showInfoIcon={false}
                    showWarningIcon={true}
                    contentColor="warning"
                  >
                    WP start date: {TextUtil.refactorDate(workPackageStartDate)}
                  </ModalText>
                  <Controller
                    name="startDate"
                    defaultValue={!edit ? "" : taskStartDate}
                    control={control}
                    rules={{
                      required: "Start date is required!",
                      validate: (value) => {
                        if (!value) {
                          return "Start date is required!";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <Datepicker
                        defaultDate={
                          !edit
                            ? new Date(Date.now())
                            : new Date(taskStartDate || Date.now())
                        }
                        minDate={new Date(workPackageStartDate || Date.now())}
                        maxDate={new Date(workPackageEndDate || Date.now())}
                        {...field}
                        placeholder="Select start date."
                        onSelectedDateChanged={(date) =>
                          field.onChange(TextUtil.formatFormDate(date))
                        }
                      />
                    )}
                  />
                  <CustomModalError error={errors.startDate?.message} />
                </div>
                <div className="w-[270px]">
                  <Label>End date</Label>
                  <ModalText
                    showInfoIcon={false}
                    showWarningIcon={true}
                    contentColor="warning"
                  >
                    WP end date: {TextUtil.refactorDate(workPackageEndDate)}
                  </ModalText>
                  <Controller
                    name="endDate"
                    defaultValue={!edit ? "" : taskEndDate}
                    control={control}
                    rules={{
                      required: "End date is required!",
                      validate: (value) => {
                        if (!value) {
                          return "End date is required!";
                        }
                        if (value < watchStartDate) {
                          return "End date cannot be before start date!";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <Datepicker
                        defaultDate={
                          !edit
                            ? new Date(Date.now())
                            : new Date(taskEndDate || Date.now())
                        }
                        minDate={new Date(workPackageStartDate || Date.now())}
                        maxDate={new Date(workPackageEndDate || Date.now())}
                        {...field}
                        placeholder="Select end date."
                        onSelectedDateChanged={(date) =>
                          field.onChange(TextUtil.formatFormDate(date))
                        }
                      />
                    )}
                  />
                  <CustomModalError error={errors.endDate?.message} />
                </div>
              </div>
              <div className="flex flex-col pt-6 items-start">
                <Label>Relevant</Label>
                <div
                  className={`flex ${
                    !isOn ? "justify-start" : "justify-end"
                  } p-1 w-10 h-6 rounded-2xl ${
                    !isOn ? "bg-gray-300" : "bg-custom-green"
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
            </CustomModalBody>
            <CustomModalFooter>
              {!edit ? <span>Add task</span> : <span>confirm</span>}
            </CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

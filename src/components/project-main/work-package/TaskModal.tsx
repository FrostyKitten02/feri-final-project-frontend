import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CreateTaskRequest } from "../../../../temp_ts";
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

export default function TaskModal({
  handleClose,
  handleAddTask,
  workPackageId,
  workPackageTitle,
  workPackageStartDate,
  workPackageEndDate,
}: TaskModalProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormFields>();
  const watchStartDate = watch("startDate");
  register("isRelevant", { value: true });

  const [isOn, setIsOn] = useState(true);
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

  return (
    <>
      <CustomModal closeModal={handleClose} modalWidth="700px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomModalHeader handleModalOpen={handleClose}>
            <ModalTitle>
              Add a task to work package: {workPackageTitle}
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
                  defaultValue={""}
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
                  defaultValue={""}
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
                  !isOn ? "bg-gray-300" : "bg-green"
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
          <CustomModalFooter>Add task</CustomModalFooter>
        </form>
      </CustomModal>
    </>
  );
}

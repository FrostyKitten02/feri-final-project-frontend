import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CreateTaskRequest, UpdateTaskRequest } from "../../../../temp_ts";
import { TaskModalProps } from "../../../interfaces";
import { TaskFormFields } from "../../../types/types";
import { taskAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { toastSuccess } from "../../toast-modals/ToastFunctions";
import { Datepicker, Label, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import TextUtil from "../../../util/TextUtil";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import ModalPortal from "../../template/modal/ModalPortal";
import RequestUtil from "../../../util/RequestUtil";

export default function TaskModal({
  onSuccess,
  workpackage,
  task,
  isOpen,
  onClose,
}: TaskModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isOn, setIsOn] = useState<boolean>(task?.isRelevant ?? true);
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
  register("isRelevant", { value: task?.isRelevant ?? true });
  const toggleSwitch = (): void => {
    setIsOn(!isOn);
    setValue("isRelevant", !isOn);
  };
  const handleClose = (): void => {
    if (task) {
      onClose?.();
      reset();
    }
    setModalOpen(false);
  };
  const onSubmit: SubmitHandler<TaskFormFields> = async (
    data
  ): Promise<void> => {
    try {
      if (task?.id) {
        const updateTask: UpdateTaskRequest = {
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          isRelevant: data.isRelevant,
        };
        const response = await taskAPI.updateTask(
          task.id,
          updateTask,
          await requestArgs.getRequestArgs()
        );
        if (response.status === 200) {
          reset();
          handleClose();
          onSuccess();
          toastSuccess("Task " + data.title + " was successfully updated.");
        }
      } else {
        const createTask: CreateTaskRequest = {
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          isRelevant: data.isRelevant,
          workPackageId: workpackage?.id,
        };
        const response = await taskAPI.createTask(
          createTask,
          await requestArgs.getRequestArgs()
        );
        if (response.status === 201) {
          reset();
          handleClose();
          onSuccess();
          toastSuccess("Task " + data.title + " was successfully created.");
        }
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    }
  };

  return (
    <>
      {!task && (
        <button
          onClick={() => setModalOpen(true)}
          className={`w-24 h-8 rounded-xl border-solid border-2 border-gray-200 flex items-center justify-center hover:bg-gray-100 transition delay-50 hover:border-primary`}
        >
          <span className="text-md font-semibold">New task</span>
        </button>
      )}
      {(modalOpen || isOpen) && (
        <ModalPortal>
          <CustomModal closeModal={handleClose} modalWidth="700px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomModalHeader handleModalClose={handleClose}>
                <ModalTitle>
                  {!task ? (
                    <div>Add a task to work package</div>
                  ) : (
                    <div>Edit task</div>
                  )}
                </ModalTitle>
                <ModalText showIcon={true} contentColor="muted">
                  Information provided in the form can be changed later on.
                  <div className="flex items-center text-black text-md">
                    <div>You are curently working on</div>
                    <div className="font-semibold pl-[5px]">
                      {workpackage?.title}
                    </div>
                    <div>.</div>
                  </div>
                  <div className="flex items-center text-black text-md">
                    <div>Remember that work package starts on</div>
                    <div className="font-semibold px-[5px]">
                      {TextUtil.refactorDate(workpackage?.startDate)}
                    </div>
                    <div>and ends on</div>
                    <div className="font-semibold pl-[5px]">
                      {TextUtil.refactorDate(workpackage?.endDate)}
                    </div>
                    <div>.</div>
                  </div>
                </ModalText>
              </CustomModalHeader>
              <CustomModalBody>
                <div>
                  <Label>Task title</Label>
                  <TextInput
                    defaultValue={task && task.title}
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
                    <Controller
                      name="startDate"
                      defaultValue={task && task.startDate}
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
                            !task
                              ? new Date(Date.now())
                              : new Date(task.startDate || Date.now())
                          }
                          minDate={
                            new Date(workpackage?.startDate || Date.now())
                          }
                          maxDate={new Date(workpackage?.endDate || Date.now())}
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
                    <Controller
                      name="endDate"
                      defaultValue={task && task.endDate}
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
                            !task
                              ? new Date(Date.now())
                              : new Date(task.endDate || Date.now())
                          }
                          minDate={
                            new Date(workpackage?.startDate || Date.now())
                          }
                          maxDate={new Date(workpackage?.endDate || Date.now())}
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
                {!task ? <span>Add task</span> : <span>confirm</span>}
              </CustomModalFooter>
            </form>
          </CustomModal>
        </ModalPortal>
      )}
    </>
  );
}

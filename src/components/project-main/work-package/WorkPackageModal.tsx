import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  CreateWorkPackageRequest,
  UpdateWorkPackageRequest,
} from "../../../../temp_ts";
import { WorkPackageModalProps } from "../../../interfaces";
import { WorkPackageFormFields } from "../../../types/forms/formTypes";
import { workPackageAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { toastSuccess, toastError } from "../../toast-modals/ToastFunctions";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalDivider,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { Datepicker, Label, TextInput } from "flowbite-react";
import TextUtil from "../../../util/TextUtil";
import { TbCalendarUser } from "react-icons/tb";
import { motion } from "framer-motion";
import PackagePlusIcon from "../../../assets/icons/package-plus-svgrepo-com.svg?react";
import { FiEdit3 } from "react-icons/fi";

export default function WorkPackageModal({
  handleAddWorkPackage,
  projectDetails,
  edit,
  title,
  startDate,
  endDate,
  isRelevant,
  assignedPM,
  workPackageId,
}: WorkPackageModalProps) {
  const { projectId } = useParams();
  const requestArgs = useRequestArgs();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WorkPackageFormFields>();
  const watchStartDate = watch("startDate");
  register("isRelevant", { value: !edit ? true : isRelevant }); // register the isRelevant field here, because it's a custom component not input

  const [isOn, setIsOn] = useState(!edit ? true : isRelevant);
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
          reset();
          setModalOpen(false);
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

  const onEdit: SubmitHandler<WorkPackageFormFields> = async (
    data
  ): Promise<void> => {
    const workPackage: UpdateWorkPackageRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      isRelevant: data.isRelevant,
      assignedPM: data.assignedPM,
    };

    try {
      if (workPackageId) {
        const response = await workPackageAPI.updateWorkPackage(
          workPackageId,
          workPackage,
          requestArgs
        );
        if (response.status === 200) {
          reset();
          setModalOpen(false);
          handleAddWorkPackage();
          toastSuccess(
            "Work package " + data.title + " was successfully edited!"
          );
        }
      } else {
        toastError("Work package id not found!");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleCloseEdit = (): void => {
    reset();
    setModalOpen(false);
  };

  return (
    <>
      {edit ? (
        <button onClick={() => setModalOpen(true)}>
          <FiEdit3 className="size-6 stroke-gray-700 hover:stroke-primary transition delay-50" />
        </button>
      ) : (
        <button onClick={() => setModalOpen(true)}>
          <PackagePlusIcon className="stroke-black size-12 hover:stroke-primary transition delay-50" />
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
                  <span>Add a work package</span>
                ) : (
                  <span>Edit work package: {title}</span>
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
                <Label>Work package title</Label>
                <TextInput
                  defaultValue={!edit ? "" : title}
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
                    Project start date:{" "}
                    {TextUtil.refactorDate(projectDetails?.startDate)}
                  </ModalText>
                  <Controller
                    name="startDate"
                    defaultValue={!edit ? "" : startDate}
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
                            : new Date(startDate || Date.now())
                        }
                        minDate={
                          new Date(projectDetails?.startDate || Date.now())
                        }
                        maxDate={
                          new Date(projectDetails?.endDate || Date.now())
                        }
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
                    Project end date:{" "}
                    {TextUtil.refactorDate(projectDetails?.endDate)}
                  </ModalText>
                  <Controller
                    name="endDate"
                    defaultValue={!edit ? "" : endDate}
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
                            : new Date(endDate || Date.now())
                        }
                        minDate={
                          new Date(projectDetails?.startDate || Date.now())
                        }
                        maxDate={
                          new Date(projectDetails?.endDate || Date.now())
                        }
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
              <ModalDivider>details</ModalDivider>
              <div className="flex flex-row pt-6 justify-between">
                <div className="w-[270px]">
                  <Label>No. person months involved</Label>
                  <TextInput
                    defaultValue={!edit ? "" : assignedPM}
                    type="number"
                    min="0"
                    rightIcon={TbCalendarUser}
                    {...register("assignedPM", {
                      required: "PM can not be empty!",
                    })}
                  />
                  <CustomModalError error={errors.assignedPM?.message} />
                </div>
                <div className="w-[270px]">
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
              </div>
            </CustomModalBody>
            <CustomModalFooter>
              {!edit ? <span>add</span> : <>confirm</>}
            </CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { CreateWorkPackageRequest, ProjectDto } from "../../../../temp_ts";
import { WorkPackageModalProps } from "../../../interfaces";
import { WorkPackageFormFields } from "../../../types/forms/formTypes";
import { projectAPI, workPackageAPI } from "../../../util/ApiDeclarations";
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

export default function WorkPackageModal({
  handleClose,
  handleAddWorkPackage,
  setIsFormOpen,
}: WorkPackageModalProps) {
  const { projectId } = useParams();
  const requestArgs = useRequestArgs();
  const [projectDetails, setProjectDetails] = useState<ProjectDto>();

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WorkPackageFormFields>();
  const watchStartDate = watch("startDate");
  register("isRelevant", { value: true }); // register the isRelevant field here, because it's a custom component not input

  const [isOn, setIsOn] = useState(true);
  const toggleSwitch = (): void => {
    setIsOn(!isOn);
    setValue("isRelevant", !isOn);
  };

  const fetchProjectDetails = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200) {
          setProjectDetails(response.data.projectDto);
        }
      } else {
        toastError("Project id not found");
      }
    } catch (error: any) {
      toastError(error.message);
    }
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

  return (
    <>
      <CustomModal closeModal={handleClose} modalWidth="700px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomModalHeader handleModalOpen={() => setIsFormOpen(false)}>
            <ModalTitle>Add a work package</ModalTitle>
            <ModalText showInfoIcon={true} showWarningIcon={false} contentColor="muted">
              Information provided in the form can be changed later on.
            </ModalText>
          </CustomModalHeader>
          <CustomModalBody>
            <div>
              <Label>Work package title</Label>
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
                <ModalText showInfoIcon={false} showWarningIcon={true} contentColor="warning">
                  Project start date:{" "}
                  {TextUtil.refactorDate(projectDetails?.startDate)}
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
                <ModalText showInfoIcon={false} showWarningIcon={true} contentColor="warning">
                  Project end date:{" "}
                  {TextUtil.refactorDate(projectDetails?.endDate)}
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
            <ModalDivider>details</ModalDivider>
            <div className="flex flex-row pt-6 justify-between">
              <div className="w-[270px]">
                <Label>No. person months involved</Label>
                <TextInput
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
            </div>
          </CustomModalBody>
          <CustomModalFooter>Add</CustomModalFooter>
        </form>
      </CustomModal>
    </>
  );
}

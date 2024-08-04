import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { WorkloadModalProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { WorkloadFormFields } from "../../../types/types";
import {
  CreateOccupancyRequest,
  UpdateOccupancyRequest,
} from "../../../../temp_ts";
import { occupancyAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";

export const WorkloadModal = ({
  closeModal,
  modalWidth,
  monthDate,
  person,
  handleEdit,
}: WorkloadModalProps) => {
  const { projectId } = useParams();
  const { register, reset, handleSubmit } = useForm<WorkloadFormFields>();
  const { monthName, year } = useMemo(() => {
    const date = TextUtil.getFirstOfYearMonth(monthDate);
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return { monthName, year };
  }, [monthDate]);
  const requestArgs = useRequestArgs();

  const handleFormSubmit = (): void => {
    reset();
    closeModal();
    handleEdit();
  };

  const onSubmit: SubmitHandler<WorkloadFormFields> = async (
    data
  ): Promise<void> => {
    console.log("here");
    try {
      if (person.occupancyId === null) {
        const workload: CreateOccupancyRequest = {
          projectId: projectId,
          personId: person.person?.id,
          toMonth: monthDate,
          fromMonth: monthDate,
          value: data.pmValue,
        };
        const response = await occupancyAPI.addOccupancy(workload, requestArgs);
        if (response.status === 201) {
          handleFormSubmit();
          toastSuccess(
            "Succesfully added occupancy of " +
              data.pmValue +
              " PM to " +
              person.person?.name +
              " " +
              person.person?.lastname +
              ", for " +
              monthName +
              ", " +
              year
          );
        }
      } else {
        const workload: UpdateOccupancyRequest = {
          occupancyId: person.occupancyId,
          value: data.pmValue,
        };
        const response = await occupancyAPI.updateOccupancy(
          workload,
          requestArgs
        );
        if (response.status === 200) {
          handleFormSubmit();
          toastSuccess(
            "Succesfully updated the occupancy of " +
              person.person?.name +
              " " +
              person.person?.lastname +
              " to " +
              data.pmValue +
              " PM, for " +
              monthName +
              ", " +
              year
          );
        }
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };
  return (
    <CustomModal closeModal={closeModal} modalWidth={modalWidth}>
      <CustomModalHeader handleModalClose={closeModal}>
        <ModalTitle>Edit workload</ModalTitle>
        <ModalText
          showIcon={true}
          contentColor="muted"
        >
          Information provided in the form can be changed later on.
        </ModalText>
      </CustomModalHeader>{" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomModalBody>
          <div className="">
            <div>
              You are currently editing {person.person?.name}{" "}
              {person.person?.lastname}'s workload for {monthName}, {year}.
            </div>
            <div className="flex">
              <div>PM:</div>
              <TextInput
                type="number"
                min={0}
                defaultValue={person.totalWorkPm}
                {...register("pmValue")}
              />
            </div>
          </div>
        </CustomModalBody>
        <CustomModalFooter>edit</CustomModalFooter>
      </form>
    </CustomModal>
  );
};

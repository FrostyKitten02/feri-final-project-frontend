import { useState } from "react";
import { CreateSalaryRequest } from "../../../temp_ts";
import { AdminModalProps } from "../../interfaces";
import { salaryApi } from "../../util/ApiDeclarations";
import { useRequestArgs } from "../../util/CustomHooks";
import { toastError, toastSuccess } from "../toast-modals/ToastFunctions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SalaryFormFields } from "../../types/forms/formTypes";
import { Label, Datepicker, TextInput } from "flowbite-react";
import TextUtil from "../../util/TextUtil";
import {
  CustomModal,
  CustomModalHeader,
  ModalTitle,
  ModalText,
  CustomModalBody,
  CustomModalError,
  ModalDivider,
  CustomModalFooter,
} from "../template/modal/CustomModal";
import { FaEuroSign } from "react-icons/fa6";
import ModalPortal from "../template/modal/ModalPortal";

export default function SalaryModal({
  setActionPopoverOpen,
  onButtonClick,
  onModalClose,
  userId,
  userEmail,
  refetchUserList
}: AdminModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();

  const handleButtonClick = (): void => {
    onButtonClick();
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    onModalClose();
    setModalOpen(false);
    setActionPopoverOpen(false);
  };

  const handleCloseOnSubmit = (): void => {
    reset();
    onModalClose();
    setModalOpen(false);
    setActionPopoverOpen(false);
  };

  const {
    handleSubmit,
    control,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm<SalaryFormFields>();
  const watchStartDate = watch("startDate");

  const onSubmit: SubmitHandler<SalaryFormFields> = async (
    data
  ): Promise<void> => {
    const salary: CreateSalaryRequest = {
      personId: userId,
      amount: data.amount,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    try {
      const response = await salaryApi.createSalaryForPerson(
        salary,
        requestArgs
      );
      if (response.status === 201) {
        handleCloseOnSubmit();
        toastSuccess(
          "Salary of " +
            data.amount +
            "€" +
            " was succesfully set for " +
            userEmail
        );
        refetchUserList();
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="flex flex-row items-center justify-start text-gray-500 h-full text-sm font-semibold hover:text-gray-800 fill-gray-500  hover:fill-gray-800 transition delay-50 gap-x-4 pl-4"
      >
        <FaEuroSign className="size-4" />
        <span>Manage salary</span>
      </button>
      {modalOpen && (
        <ModalPortal>
          <CustomModal closeModal={handleCloseModal} modalWidth="700px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomModalHeader handleModalOpen={handleCloseModal}>
                <ModalTitle>set salary for user: {userEmail}</ModalTitle>
                <ModalText
                  showInfoIcon={true}
                  showWarningIcon={false}
                  contentColor="muted"
                >
                  Information provided in the form can be changed later on.
                </ModalText>
              </CustomModalHeader>
              <CustomModalBody>
                <ModalDivider>salary details</ModalDivider>
                <div className="flex flex-row justify-between">
                  <div>
                    <Label>Start date</Label>
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
                          className="w-[270px]"
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
                  <div>
                    <Label>End date</Label>
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
                          className="w-[270px]"
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
                <div className="pt-6">
                  <Label>Amount</Label>
                  <TextInput
                    type="number"
                    min={0}
                    className="w-[270px]"
                    {...register("amount", {
                      required: "Salary amount can not be empty!",
                    })}
                    rightIcon={FaEuroSign}
                  />
                  <CustomModalError error={errors.amount?.message} />
                </div>
              </CustomModalBody>
              <CustomModalFooter>confirm</CustomModalFooter>
            </form>
          </CustomModal>
        </ModalPortal>
      )}
    </>
  );
}

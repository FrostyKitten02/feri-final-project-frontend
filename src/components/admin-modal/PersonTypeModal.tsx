import { useState } from "react";
import { CreatePersonTypeRequest } from "../../../temp_ts";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../template/modal/CustomModal";
import { useRequestArgs } from "../../util/CustomHooks";
import { personTypeAPI } from "../../util/ApiDeclarations";
import { toastError, toastSuccess } from "../toast-modals/ToastFunctions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PersonTypeFormFields } from "../../types/types";
import { AdminModalProps } from "../../interfaces";
import { Datepicker, Label, TextInput } from "flowbite-react";
import { FaPercent } from "react-icons/fa6";
import TextUtil from "../../util/TextUtil";
import { BsFillPersonVcardFill } from "react-icons/bs";
import ModalPortal from "../template/modal/ModalPortal";

export default function PersonTypeModal({
  setActionPopoverOpen,
  onButtonClick,
  onModalClose,
  userId,
  userEmail,
  refetchUserList,
}: AdminModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();

  const handleButtonClick = (): void => {
    onButtonClick();
    setModalOpen(true);
  };

  const handleClose = (): void => {
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
  } = useForm<PersonTypeFormFields>();
  const watchStartDate = watch("startDate");

  const onSubmit: SubmitHandler<PersonTypeFormFields> = async (
    data
  ): Promise<void> => {
    const personType: CreatePersonTypeRequest = {
      name: data.name,
      research: data.research / 100,
      educate: data.educate / 100,
      startDate: data.startDate,
      endDate: data.endDate,
      personId: userId,
    };

    try {
      const response = await personTypeAPI.createPersonType(
        personType,
        requestArgs
      );
      if (response.status === 201) {
        handleClose();
        toastSuccess(data.name + " was successfully assigned to " + userEmail);
        refetchUserList?.();
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="flex flex-row items-center justify-start text-gray-500 h-full text-sm font-semibold hover:text-gray-800 fill-gray-500  hover:fill-gray-800 transition delay-50 gap-x-4 pl-4 hover:bg-gray-100"
      >
        <BsFillPersonVcardFill className="size-4" />
        <span>Manage employment type</span>
      </button>
      {modalOpen && (
        <ModalPortal>
          <CustomModal closeModal={handleClose} modalWidth="700px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomModalHeader handleModalOpen={handleClose}>
                <ModalTitle>
                  set employment type
                </ModalTitle>
                <ModalText
                  showInfoIcon={true}
                  showWarningIcon={false}
                  contentColor="muted"
                >
                  Employment types in the same interval will be overwritten with newer values. If end date is not specified, employment interval
                  will be ongoing and will end when newer value is added.
                  <div className="flex items-center text-black text-md">
                    <div>
                      You are setting employment type for
                    </div>
                    <div className="font-semibold pl-[5px]">
                      {userEmail}
                    </div>
                    <div>.</div>
                  </div>
                </ModalText>
              </CustomModalHeader>
              <CustomModalBody>
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
                        validate: (value) => {
                          if (value && value < watchStartDate) {
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
                  <Label>Name</Label>
                  <TextInput
                    type="text"
                    className="w-[270px]"
                    {...register("name", {
                      required: "Name can not be empty!",
                    })}
                  />
                  <CustomModalError error={errors.name?.message} />
                </div>
                <div className="flex flex-row justify-between pt-6">
                  <div>
                    <Label>Research</Label>
                    <TextInput
                      type="number"
                      min={0}
                      max={100}
                      className="w-[270px]"
                      {...register("research", {
                        required: "Research can not be empty!",
                      })}
                      rightIcon={FaPercent}
                    />
                    <CustomModalError error={errors.research?.message} />
                  </div>
                  <div>
                    <Label>Educate</Label>
                    <TextInput
                      type="number"
                      min={0}
                      max={100}
                      className="w-[270px]"
                      {...register("educate", {
                        required: "Educate can not be empty!",
                      })}
                      rightIcon={FaPercent}
                    />
                    <CustomModalError error={errors.educate?.message} />
                  </div>
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

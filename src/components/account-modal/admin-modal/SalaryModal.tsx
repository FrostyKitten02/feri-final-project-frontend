import {CreateSalaryRequest} from "../../../../client";
import {AdminModalProps} from "../../../interfaces";
import {salaryApi} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {toastSuccess} from "../../toast-modals/ToastFunctions";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {SalaryFormFields} from "../../../types/types";
import {Datepicker, Label, TextInput} from "flowbite-react";
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
import {FaEuroSign} from "react-icons/fa6";
import ModalPortal from "../../template/modal/ModalPortal";
import RequestUtil from "../../../util/RequestUtil";

export default function SalaryModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  refetchUserList,
}: AdminModalProps) {
  const requestArgs = useRequestArgs();

  const handleClose = (): void => {
    reset();
    onClose?.();
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
          await requestArgs.getRequestArgs()
      );
      if (response.status === 201) {
        handleClose();
        toastSuccess(
          "Salary of " +
            data.amount +
            "€" +
            " was succesfully set for " +
            userEmail
        );
        refetchUserList?.();
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalPortal>
        <CustomModal closeModal={handleClose} modalWidth="700px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomModalHeader handleModalClose={handleClose}>
              <ModalTitle>set salary</ModalTitle>
              <ModalText showIcon={true} contentColor="muted">
                Salaries in the same interval will be overwritten with newer
                values. If end date is not specified, salary interval will be
                ongoing and will end when newer value is added.
                <div className="flex items-center text-black text-md">
                  <div>You are setting salary for</div>
                  <div className="font-semibold pl-[5px]">{userEmail}</div>
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
    </>
  );
}

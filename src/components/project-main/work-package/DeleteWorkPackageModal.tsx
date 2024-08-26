import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import {SubmitHandler, useForm} from "react-hook-form";
import {DeleteConfirmationFields} from "../../../types/types";
import {DeleteWorkPackageModalProps} from "../../../interfaces";
import {TextInput} from "flowbite-react";
import {workPackageAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {useRequestArgs} from "../../../util/CustomHooks";
import ModalPortal from "../../template/modal/ModalPortal";

export const DeleteWorkPackageModal = ({
  workpackage,
  onSuccess,
  isOpen,
  onClose,
}: DeleteWorkPackageModalProps) => {
  const requestArgs = useRequestArgs();
  const handleModalClose = (): void => {
    onClose?.();
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteConfirmationFields>();
  const onDelete: SubmitHandler<any> = async () => {
    try {
      if (workpackage?.id) {
        const response = await workPackageAPI.deleteWorkPackage(
          workpackage.id,
            await requestArgs.getRequestArgs()
        );
        if (response.status === 200 || response.status === 204) {
          onSuccess();
          toastSuccess(
            `Work package ${workpackage.title} was successfully deleted.`
          );
          onClose?.();
        }
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalPortal>
        <CustomModal closeModal={handleModalClose}>
          <form onSubmit={handleSubmit(onDelete)}>
            <CustomModalHeader handleModalClose={handleModalClose}>
              <ModalTitle>delete work package</ModalTitle>
              <ModalText contentColor="danger" showIcon={true}>
                This action <span className="font-semibold"> cannot </span> be
                undone!
                <span className="font-semibold"> {workpackage?.title} </span>
                and all of the associated tasks will be{" "}
                <span className="font-semibold"> permanently </span> deleted.
              </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
              <div className="font-semibold">
                Please type in the full title of the work package to confirm
                deletion.
              </div>
              <TextInput
                defaultValue={""}
                type="text"
                {...register("title", {
                  required: "This field can not be empty!",
                  validate: (value) => {
                    if (workpackage && value !== workpackage.title) {
                      return "The input text and the work package title don't match.";
                    }
                  },
                })}
              />
              <CustomModalError error={errors.title?.message} />
            </CustomModalBody>
            <CustomModalFooter danger={true}>
              I understand, permanently delete.
            </CustomModalFooter>
          </form>
        </CustomModal>
      </ModalPortal>
    </>
  );
};

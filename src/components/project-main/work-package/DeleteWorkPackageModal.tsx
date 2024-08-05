import { HiOutlineTrash } from "react-icons/hi2";
import { useState } from "react";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { DeleteConfirmationFields } from "../../../types/types";
import { DeleteWorkPackageModalProps } from "../../../interfaces";
import { TextInput } from "flowbite-react";
import { workPackageAPI } from "../../../util/ApiDeclarations";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import ModalPortal from "../../template/modal/ModalPortal";

export const DeleteWorkPackageModal = ({
  workpackage,
  onSuccess,
  setActionPopoverOpen,
  onButtonClick,
  onModalClose,
}: DeleteWorkPackageModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const requestArgs = useRequestArgs();
  const handleModalClose = (): void => {
    onModalClose?.();
    setOpen(false);
    setActionPopoverOpen?.(false);
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
          requestArgs
        );
        if (response.status === 200 || response.status === 204) {
          onSuccess();
          toastSuccess(
            `Work package ${workpackage.title} was successfully deleted.`
          );
          onModalClose?.();
          setOpen(false);
          setActionPopoverOpen?.(false);
        }
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };
  return (
    <>
      <button
        onClick={() => {
          onButtonClick?.(), setOpen(true);
        }}
        className="flex flex-row items-center justify-start text-red-500 h-full text-sm font-semibold hover:text-red-600 fill-red-500  hover:fill-red-600 transition delay-50 gap-x-4 pl-4 hover:bg-gray-100"
      >
        <HiOutlineTrash className="size-5" />
        <span>Delete work package</span>
      </button>
      {open && (
        <ModalPortal>
          <CustomModal closeModal={handleModalClose}>
            <form onSubmit={handleSubmit(onDelete)}>
              <CustomModalHeader handleModalClose={handleModalClose}>
                <ModalTitle>delete work package</ModalTitle>
                <ModalText contentColor="danger" showIcon={true}>
                  This action <span className="font-semibold"> cannot </span> be
                  undone!
                  <span className="font-semibold"> {workpackage?.title} </span>
                  will be <span className="font-semibold">
                    {" "}
                    permanently{" "}
                  </span>{" "}
                  deleted.
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
      )}
    </>
  );
};

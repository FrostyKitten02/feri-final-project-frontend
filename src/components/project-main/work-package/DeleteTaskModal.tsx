import { HiOutlineTrash } from "react-icons/hi2";
import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { useState } from "react";
import { useRequestArgs } from "../../../util/CustomHooks";
import { DeleteTaskModalProps } from "../../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { taskAPI } from "../../../util/ApiDeclarations";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import ModalPortal from "../../template/modal/ModalPortal";

export const DeleteTaskModal = ({
  task,
  onSuccess,
  setActionPopoverOpen,
  onButtonClick,
  onModalClose,
}: DeleteTaskModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const requestArgs = useRequestArgs();
  const { handleSubmit } = useForm<any>();
  const handleModalClose = (): void => {
    onModalClose?.();
    setOpen(false);
    setActionPopoverOpen?.(false);
  };
  const onDelete: SubmitHandler<any> = async () => {
    try {
      if (task.id) {
        const response = await taskAPI.deleteTask(task.id, requestArgs);
        if (response.status === 200 || response.status === 204) {
          onSuccess();
          toastSuccess(`Task ${task.title} was successfully deleted.`);
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
        <span>Delete task</span>
      </button>
      {open && (
        <ModalPortal>
          <CustomModal closeModal={handleModalClose}>
            <form onSubmit={handleSubmit(onDelete)}>
              <CustomModalHeader handleModalClose={handleModalClose}>
                <ModalTitle>delete task</ModalTitle>
                <ModalText contentColor="danger" showIcon={true}>
                  This action <span className="font-semibold"> cannot </span> be
                  undone!
                  <span className="font-semibold"> {task.title} </span>
                  will be <span className="font-semibold">
                    {" "}
                    permanently{" "}
                  </span>{" "}
                  deleted.
                </ModalText>
              </CustomModalHeader>
              <CustomModalBody>
                <div className="font-semibold">
                  Are you sure you want to delete {task.title}?
                </div>
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

import { useRequestArgs } from "../../../util/CustomHooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { DeleteFileModalFields } from "../../../types/types";
import {
  CustomModal,
  CustomModalHeader,
  ModalTitle,
  ModalText,
  CustomModalBody,
  CustomModalFooter,
} from "../../template/modal/CustomModal";
import ModalPortal from "../../template/modal/ModalPortal";
import { DeleteFileModalProps } from "../../../interfaces";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../toast-modals/ToastFunctions";
import { projectAPI } from "../../../util/ApiDeclarations";

export const DeleteFileModal = ({
  file,
  refetchFileList,
  isOpen,
  onClose,
}: DeleteFileModalProps) => {
  const requestArgs = useRequestArgs();

  const { handleSubmit } = useForm<DeleteFileModalFields>();

  const handleModalClose = (): void => {
    onClose?.();
  };

  const onDelete: SubmitHandler<
    DeleteFileModalFields
  > = async (): Promise<void> => {
    try {
      if (file.id) {
        const response = await projectAPI.deleteProjectFile(
          file.id,
          requestArgs
        );
        if (response.status === 200) {
          refetchFileList();
          toastSuccess(
            `File ${file.originalFileName} was successfully deleted.`
          );
        }
      } else {
        toastWarning("File id not found.");
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
              <ModalTitle>delete file</ModalTitle>
              <ModalText contentColor="danger" showIcon={true}>
                This action <span className="font-semibold"> cannot </span> be
                undone!
                <span className="font-semibold"> {file.originalFileName} </span>
                will be <span className="font-semibold">
                  {" "}
                  permanently{" "}
                </span>{" "}
                deleted.
              </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
              <div className="font-semibold">
                Are you sure you want to delete {file.originalFileName}?
              </div>
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

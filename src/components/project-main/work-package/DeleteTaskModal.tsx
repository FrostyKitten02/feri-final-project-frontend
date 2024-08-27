import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { useRequestArgs } from "../../../util/CustomHooks";
import { DeleteTaskModalProps } from "../../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { taskAPI } from "../../../util/ApiDeclarations";
import {
  toastSuccess,
  toastWarning,
} from "../../toast-modals/ToastFunctions";
import ModalPortal from "../../template/modal/ModalPortal";
import RequestUtil from "../../../util/RequestUtil";

export const DeleteTaskModal = ({
  task,
  onSuccess,
  isOpen,
  onClose,
}: DeleteTaskModalProps) => {
  const requestArgs = useRequestArgs();
  const { handleSubmit } = useForm<any>();
  const handleModalClose = (): void => {
    onClose?.();
  };
  const onDelete: SubmitHandler<any> = async () => {
    try {
      if (task.id) {
        const response = await taskAPI.deleteTask(
          task.id,
          await requestArgs.getRequestArgs()
        );
        if (response.status === 200 || response.status === 204) {
          onSuccess();
          toastSuccess(`Task ${task.title} was successfully deleted.`);
          onClose?.();
        }
      } else {
        toastWarning("Task id not found");
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
    </>
  );
};

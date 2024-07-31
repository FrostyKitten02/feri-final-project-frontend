import { useState } from "react";
import { DeleteModalProps } from "../../../interfaces";
import { HiOutlineTrash } from "react-icons/hi2";
import { BsPersonDash } from "react-icons/bs";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalTitle,
} from "./CustomModal";
import { DeleteConfirmationFields } from "../../../types/forms/formTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextInput } from "flowbite-react";
import { taskAPI, workPackageAPI } from "../../../util/ApiDeclarations";
import { toastSuccess, toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";

export default function DeleteModal({
  id,
  title,
  handleDelete,
  teamPage,
  workPackage,
}: DeleteModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();

  const onDelete: SubmitHandler<
    DeleteConfirmationFields
  > = async (): Promise<void> => {
    try {
      if (id) {
        let response;
        if (workPackage) {
          response = await workPackageAPI.deleteWorkPackage(id, requestArgs);
        } else {
          response = await taskAPI.deleteTask(id, requestArgs);
        }
        if (response.status === 200) {
          handleClose();
          handleDelete();
          toastSuccess(
            `${
              workPackage ? "Work package " : "Task "
            } ${title} was successfully deleted.`
          );
        }
      } else {
        toastError("Work package id not found.");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteConfirmationFields>();

  const handleClose = (): void => {
    setModalOpen(false);
    reset();
  };

  return (
    <>
      {!teamPage ? (
        <button onClick={() => setModalOpen(true)}>
          <HiOutlineTrash className="size-6 stroke-red-500 transition delay-50 hover:stroke-red-500/70" />
        </button>
      ) : (
        <button onClick={() => setModalOpen(true)}>
          <BsPersonDash className="size-6 fill-gray-500 hover:fill-red-500 transition delay-50" />
        </button>
      )}

      {modalOpen && (
        <CustomModal closeModal={handleClose} modalWidth="700px">
          <form onSubmit={handleSubmit(onDelete)}>
            <CustomModalHeader handleModalOpen={handleClose}>
              <ModalTitle>
                <span>{!teamPage ? "delete" : "remove"} confirmation</span>
              </ModalTitle>
            </CustomModalHeader>
            <CustomModalBody>
              <div className="flex flex-col gap-y-2">
                <p className="text-lg text-gray-600">
                  This action{" "}
                  <span className="text-black font-semibold">CANNOT</span> be
                  undone. This will permanently delete{" "}
                  <span className="text-black font-semibold">"{title}"</span>
                  {workPackage ? <span> and the associated tasks.</span> : "."}
                </p>
                {workPackage && (
                  <div className="flex flex-col">
                    <p className="text-md text-black font-semibold">
                      Please type in the full title of the work package to
                      confirm.
                    </p>
                    <TextInput
                      defaultValue={""}
                      type="text"
                      {...register("title", {
                        required: "This field can not be empty!",
                        validate: (value) => {
                          if (value != title) {
                            return "The input text and the work package title don't match.";
                          }
                        },
                      })}
                    />
                    <CustomModalError error={errors.title?.message} />
                  </div>
                )}
              </div>
            </CustomModalBody>
            <CustomModalFooter danger={true}>
              <span className="flex flex-row gap-x-2">
                <HiOutlineTrash className="size-6 stroke-white" />
                <span>
                  {!teamPage ? "I understand, permanently delete" : "remove"}
                </span>
              </span>
            </CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

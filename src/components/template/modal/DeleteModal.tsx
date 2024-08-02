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
import { DeleteConfirmationFields } from "../../../types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextInput } from "flowbite-react";
import {
  projectAPI,
  taskAPI,
  workPackageAPI,
} from "../../../util/ApiDeclarations";
import { toastSuccess, toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import { useParams } from "react-router-dom";

export default function DeleteModal({
  id,
  title,
  handleDelete,
  teamPage,
  workPackage,
  personName,
  personLastName,
  personEmail,
}: DeleteModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();
  const { projectId } = useParams();

  const onDelete: SubmitHandler<
    DeleteConfirmationFields
  > = async (): Promise<void> => {
    if (!id) {
      toastError("Id not found.");
      return;
    }

    try {
      let response;
      if (workPackage) {
        response = await workPackageAPI.deleteWorkPackage(id, requestArgs);
      } else if (teamPage && projectId) {
        response = await projectAPI.removePersonFromProject(
          projectId,
          id,
          requestArgs
        );
      } else {
        response = await taskAPI.deleteTask(id, requestArgs);
      }
      if (response.status === 200 || response.status === 204) {
        handleClose();
        if (handleDelete) handleDelete();
        if (workPackage) {
          toastSuccess(`Work package ${title} was successfully deleted.`);
        } else if (teamPage) {
          const nameOrEmail =
            personName && personLastName
              ? `${personName} ${personLastName}`
              : personEmail;
          if (nameOrEmail) {
            toastSuccess(
              `${nameOrEmail} was successfully removed from the project.`
            );
          }
        } else {
          toastSuccess(`Task ${title} was successfully deleted.`);
        }
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
                  undone. This will permanently{" "}
                  {!teamPage ? "delete" : "remove"}{" "}
                  {teamPage && (
                    <>
                      {personName && personLastName ? (
                        <span className="text-black font-semibold">
                          {personName} {personLastName}
                        </span>
                      ) : personEmail ? (
                        <span className="text-black font-semibold">
                          {personEmail}
                        </span>
                      ) : null}
                      <span className="text-black"> from the project.</span>
                    </>
                  )}
                  {!teamPage && (
                    <>
                      <span className="text-black font-semibold">
                        "{title}"
                      </span>
                      {workPackage ? (
                        <span> and the associated tasks.</span>
                      ) : (
                        "."
                      )}
                    </>
                  )}
                </p>
                {(workPackage || teamPage) && (
                  <div className="flex flex-col">
                    <p className="text-md text-black font-semibold">
                      Please type in the{" "}
                      {workPackage
                        ? "full title of the work package "
                        : teamPage
                        ? "full name of the user "
                        : null}
                      to confirm.
                    </p>
                    <TextInput
                      defaultValue={""}
                      type="text"
                      {...register("title", {
                        required: "This field can not be empty!",
                        validate: (value) => {
                          if (workPackage && value !== title) {
                            return "The input text and the work package title don't match.";
                          }
                          if (teamPage) {
                            if (personName && personLastName) {
                              if (value !== `${personName} ${personLastName}`) {
                                return "The input text and the users name and last name don't match.";
                              }
                            } else if (personEmail && value !== personEmail) {
                              return "The input text and the users email don't match.";
                            }
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
                  {!teamPage
                    ? "I understand, permanently delete"
                    : "I understand, remove"}
                </span>
              </span>
            </CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

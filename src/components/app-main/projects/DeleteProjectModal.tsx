import { HiOutlineTrash } from "react-icons/hi2";
import { useEffect, useState } from "react";
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
import { DeleteProjectModalProps } from "../../../interfaces";
import { TextInput } from "flowbite-react";
import { projectAPI } from "../../../util/ApiDeclarations";
import { toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import ModalPortal from "../../template/modal/ModalPortal";
import { useNavigate, useParams } from "react-router-dom";
import { GetProjectResponse } from "../../../../temp_ts";
import Paths from "../../../util/Paths";

export const DeleteProjectModal = ({
  setActionPopoverOpen,
  onButtonClick,
  onModalClose,
}: DeleteProjectModalProps) => {
  const [projectDetails, setProjectDetails] = useState<GetProjectResponse>();
  const [open, setOpen] = useState<boolean>(false);
  const requestArgs = useRequestArgs();

  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const fetchProjectDetails = async (): Promise<void> => {
        try {
          if (projectId) {
            const response = await projectAPI.getProject(
              projectId,
              requestArgs
            );
            if (response.status === 200) {
              setProjectDetails(response.data);
            }
          } else {
            toastError("Project id not found.");
          }
        } catch (error: any) {
          toastError(error.message);
        }
      };
      fetchProjectDetails();
    }
  }, [open]);

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
      if (projectId) {
        const response = await projectAPI.deleteProject(projectId, requestArgs);
        if (response.status === 200 || response.status === 204) {
          navigate(Paths.HOME);
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
        <span>Permanently delete project</span>
      </button>
      {open && (
        <ModalPortal>
          <CustomModal closeModal={handleModalClose}>
            <form onSubmit={handleSubmit(onDelete)}>
              <CustomModalHeader handleModalClose={handleModalClose}>
                <ModalTitle>delete project</ModalTitle>
                <ModalText contentColor="danger" showIcon={true}>
                  This action <span className="font-semibold"> cannot </span> be
                  undone! Project
                  <span className="font-semibold">
                    {" "}
                    {projectDetails?.projectDto?.title}{" "}
                  </span>
                  and all of it's information will be{" "}
                  <span className="font-semibold"> permanently </span> deleted.
                </ModalText>
              </CustomModalHeader>
              <CustomModalBody>
                <div className="font-semibold">
                  Please type in the full title of the project to confirm
                  deletion.
                </div>
                <TextInput
                  defaultValue={""}
                  type="text"
                  {...register("title", {
                    required: "This field can not be empty!",
                    validate: (value) => {
                      if (value !== projectDetails?.projectDto?.title) {
                        return "The input text and the project title don't match.";
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

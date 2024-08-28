import {useEffect, useState} from "react";
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
import {TextInput} from "flowbite-react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {toastError} from "../../toast-modals/ToastFunctions";
import {useRequestArgs} from "../../../util/CustomHooks";
import ModalPortal from "../../template/modal/ModalPortal";
import {useNavigate, useParams} from "react-router-dom";
import {GetProjectResponse} from "../../../../client";
import Paths from "../../../util/Paths";
import RequestUtil from "../../../util/RequestUtil";

export const DeleteProjectModal = () => {
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
                await requestArgs.getRequestArgs()
            );
            if (response.status === 200) {
              setProjectDetails(response.data);
            }
          } else {
            toastError("Project id not found.");
          }
        } catch (error) {
          RequestUtil.handleAxiosRequestError(error);;
        }
      };
      fetchProjectDetails();
    }
  }, [open]);

  const handleModalClose = (): void => {
    reset();
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteConfirmationFields>();

  const onDelete: SubmitHandler<any> = async () => {
    try {
      if (projectId) {
        const response = await projectAPI.deleteProject(projectId, await requestArgs.getRequestArgs());
        if (response.status === 200 || response.status === 204) {
          navigate(Paths.HOME);
        }
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-row items-center justify-start text-red-400 h-full text-sm font-semibold hover:text-danger transition delay-50 gap-x-4"
      >
        <span className="uppercase">delete project</span>
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

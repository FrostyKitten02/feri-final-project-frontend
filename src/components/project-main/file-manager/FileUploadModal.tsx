import { useCallback, useState } from "react";
import ModalPortal from "../../template/modal/ModalPortal";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { MdOutlineFileUpload } from "react-icons/md";
import { toastWarning } from "../../toast-modals/ToastFunctions";
import { FaRegFileAlt } from "react-icons/fa";
import TextUtil from "../../../util/TextUtil";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { MdClear } from "react-icons/md";
import { useRequestArgs } from "../../../util/CustomHooks";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../util/ApiDeclarations";
import { toast } from "react-toastify";
import { FileUploadModalProps } from "../../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileUploadModalFields } from "../../../types/types";

export const FileUploadModal = ({ refetchFileList }: FileUploadModalProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const requestArgs = useRequestArgs();
  const { projectId } = useParams();

  const { handleSubmit, reset, setValue, getValues, clearErrors } =
    useForm<FileUploadModalFields>({
      defaultValues: {
        files: [],
      },
    });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentFiles = getValues("files");
      const totalFiles = currentFiles.length + acceptedFiles.length;
      if (totalFiles > 3) {
        toastWarning("Only 3 files are allowed to be uploaded at once.");
        return;
      }

      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > 104857600) {
          toastWarning(
            `File ${file.name} is too large! Size of 100MB exceeded.`
          );
          return false;
        }
        if (
          currentFiles.some(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.type === file.type
          )
        ) {
          toastWarning(`File ${file.name} is already selected.`);
          return false;
        }
        return true;
      });

      setValue("files", [...currentFiles, ...validFiles], {
        shouldValidate: true,
      });
      clearErrors("files");
      setFileError(null);
    },
    [setValue, setValue, clearErrors]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSubmit: SubmitHandler<FileUploadModalFields> = async (
    data
  ): Promise<void> => {
    if (data.files.length === 0) {
      setFileError("Please select a file.");
      return;
    }
    await toast.promise(
      async () => {
        if (projectId) {
          const response = await projectAPI.uploadProjectFile(
            projectId,
            data.files,
            requestArgs
          );

          if (response.status === 201 || response.status === 204) {
            reset();
            setModalOpen(false);
            refetchFileList();
          }
        } else {
          throw new Error("Project id not found.");
        }
      },
      {
        pending: "Files uploading...",
        success: "Files were successfully uploaded.",
        error: "An error occured during upload.",
      }
    );
  };

  const removeFile = (file: File): void => {
    const currentFiles = getValues("files");
    setValue(
      "files",
      currentFiles.filter((f) => f !== file)
    );
  };

  const onClose = (): void => {
    reset();
    clearErrors("files");
    setFileError(null);
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        <MdOutlineFileUpload className="fill-black size-16 hover:fill-primary transition delay-50" />
      </button>
      {modalOpen && (
        <ModalPortal>
          <CustomModal closeModal={onClose} modalWidth="800px">
            <CustomModalHeader handleModalClose={onClose}>
              <ModalTitle>upload files</ModalTitle>
              <ModalText showIcon={true} contentColor="muted">
                Upload any documents related to the project.
              </ModalText>
            </CustomModalHeader>
            <form onSubmit={handleSubmit(handleFileSubmit)}>
              <CustomModalBody>
                <div className="flex flex-col w-full h-full gap-y-2">
                  <div
                    {...getRootProps()}
                    className={`${
                      isDragActive && `border-c-blue bg-gray-100`
                    } dropzone flex flex-col justify-center items-center gap-y-2 h-[300px] w-full border-4 border-gray-300 rounded-2xl border-dashed cursor-pointer hover:border-c-blue transition delay-50`}
                  >
                    <MdOutlineFileUpload className="fill-gray-300 size-24 pb-2" />
                    <p className="text-2xl font-semibold">
                      Drag and drop your files here or browse
                    </p>
                    <p className="text-lg text-gray-500">
                      All common file types are supported
                    </p>
                    <input
                      {...getInputProps()}
                      type="file"
                      className="hidden"
                    />
                    {fileError && <CustomModalError error={fileError} />}
                  </div>
                  <div className="flex items-start justify-between pb-4 w-full">
                    <p className="text-normal text-muted font-medium">
                      Maximum size per file: 100MB
                    </p>
                    <p className="text-normal text-muted font-medium">
                      Files per upload: 3
                    </p>
                  </div>
                  {getValues("files").length > 0 &&
                    getValues("files").map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-row items-center w-full"
                      >
                        <div className="flex flex-row gap-x-2 items-center flex-grow">
                          <FaRegFileAlt
                            className={`size-10 ${TextUtil.returnFileTypeColor(
                              file
                            )}`}
                          />
                          <p className="text-black font-semibold text-lg">
                            {file.name}
                          </p>
                          <p className="text-muted font-normal text-lg">
                            {TextUtil.convertBytesToMB(file.size)}MB
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => removeFile(file)}>
                            <MdClear className="size-6 fill-black" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CustomModalBody>
              <CustomModalFooter>upload</CustomModalFooter>
            </form>
          </CustomModal>
        </ModalPortal>
      )}
    </>
  );
};

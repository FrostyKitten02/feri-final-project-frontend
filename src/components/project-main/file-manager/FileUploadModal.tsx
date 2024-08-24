import { useCallback, useState } from "react";
import ModalPortal from "../../template/modal/ModalPortal";
import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { FaFileCirclePlus } from "react-icons/fa6";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../toast-modals/ToastFunctions";
import { FaRegFileAlt } from "react-icons/fa";
import TextUtil from "../../../util/TextUtil";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { MdClear } from "react-icons/md";
import { useRequestArgs } from "../../../util/CustomHooks";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../util/ApiDeclarations";

export const FileUploadModal = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  const requestArgs = useRequestArgs();
  const { projectId } = useParams();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalFiles = selectedFiles.length + acceptedFiles.length;
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
          selectedFiles.some(
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

      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    },
    [selectedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (projectId) {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("files", selectedFiles[i]);
        }

        const updatedRequestArgs = {
          body: formData,
          headers: {
            ...requestArgs.headers,
          },
        };

        const response = await projectAPI.uploadProjectFile(
          selectedFiles,
          projectId,
          updatedRequestArgs
        );

        if (response.status === 201 || response.status === 204) {
          toastSuccess("Files successfully imported");
          setSelectedFiles([]);
          setModalOpen(false);
        }
      } else {
        toastWarning("Project id not found.");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const removeFile = (file: File): void => {
    setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const onClose = (): void => {
    setSelectedFiles([]);
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        <FaFileCirclePlus className="fill-black size-12 hover:fill-primary transition delay-50" />
      </button>
      {modalOpen && (
        <ModalPortal>
          <CustomModal closeModal={onClose} modalWidth="800px">
            <CustomModalHeader handleModalClose={onClose}>
              <ModalTitle>upload file</ModalTitle>
              <ModalText showIcon={true} contentColor="muted">
                Upload any documents related to the project.
              </ModalText>
            </CustomModalHeader>
            <form onSubmit={handleSubmit}>
              <CustomModalBody>
                <div className="flex flex-col w-full h-full gap-y-2">
                  <div
                    {...getRootProps()}
                    className={`${
                      isDragActive && `border-c-blue bg-gray-100`
                    } dropzone flex flex-col justify-center items-center gap-y-2 h-[300px] w-full border-4 border-gray-300 rounded-2xl border-dashed cursor-pointer hover:border-c-blue transition delay-50`}
                  >
                    <FaFileCirclePlus className="fill-gray-300 size-20 pb-6" />
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
                  </div>
                  <div className="flex items-start justify-between pb-4 w-full">
                    <p className="text-normal text-muted font-medium">
                      Maximum size per file: 100MB
                    </p>
                    <p className="text-normal text-muted font-medium">
                      Files per upload: 3
                    </p>
                  </div>
                  {selectedFiles.length > 0 &&
                    selectedFiles.map((file, index) => (
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
                            {TextUtil.convertBytesToMB(file.size)} MB
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
              <CustomModalFooter>import</CustomModalFooter>
            </form>
          </CustomModal>
        </ModalPortal>
      )}
    </>
  );
};

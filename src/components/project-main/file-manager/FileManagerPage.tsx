import { useEffect, useState } from "react";
import { ProjectFilesResponse } from "../../../../temp_ts";
import { FileUploadModal } from "./FileUploadModal";
import { useRequestArgs } from "../../../util/CustomHooks";
import { useParams } from "react-router-dom";
import { toastError, toastWarning } from "../../toast-modals/ToastFunctions";
import { projectAPI } from "../../../util/ApiDeclarations";
import { Spinner } from "flowbite-react";
import { FaRegFileAlt } from "react-icons/fa";
import TextUtil from "../../../util/TextUtil";
import { DeleteFileModal } from "./DeleteFileModal";

export const FileManagerPage = () => {
  const [projectFiles, setProjectFiles] = useState<ProjectFilesResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const requestArgs = useRequestArgs();
  const { projectId } = useParams();

  useEffect(() => {
    fetchProjectFiles();
  }, [projectId]);

  const fetchProjectFiles = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProjectFiles(
          projectId,
          requestArgs
        );
        if (response.status === 200) {
          setProjectFiles(response.data);
        }
      } else {
        toastWarning("Project id not found");
      }
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full p-10">
      <div
        className={`relative flex flex-col  flex-grow border-[1px] border-gray-200 border-solid rounded-[20px] px-5`}
      >
        <div className="w-full h-full px-12 rounded-bl-[20px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="xl" />
            </div>
          ) : projectFiles?.files && projectFiles.files?.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] pt-8 pb-4 px-3">
                <div className="flex justify-end items-center" />
                <div className="flex justify-center items-center gap-x-4">
                  <div className="text-sm text-gray-600 font-semibold">
                    FILE NAME
                  </div>
                </div>
                <div className="flex justify-center items-center gap-x-4">
                  <div className="text-sm text-gray-600 font-semibold">
                    FILE SIZE
                  </div>
                </div>
                <div className="flex justify-center items-center gap-x-4">
                  <div className="text-sm text-gray-600 font-semibold">
                    UPLOAD DATE
                  </div>
                </div>
                <div className="flex justify-center items-center gap-x-4">
                  <div className="text-sm text-gray-600 font-semibold">
                    ACTION
                  </div>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto px-3">
                <div className="rounded-2xl border border-solid border-gray-200 bg-white divide-y divide-solid divide-gray-200">
                  {projectFiles.files.map((file, index) => (
                    <div
                      className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] py-6"
                      key={index}
                    >
                      <div className="flex justify-end items-center">
                        <FaRegFileAlt className="size-6 fill-c-blue" />
                      </div>
                      <div className="flex flex-row items-center justify-center px-8">
                        <p className="text-normal font-semibold text-center">
                          {file.originalFileName}
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-normal text-muted">
                          {file.fileSizeMB}MB
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-normal text-muted">
                          {TextUtil.refactorDate(file.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <DeleteFileModal
                          file={file}
                          refetchFileList={fetchProjectFiles}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <p className="text-2xl font-bold">
                This project does not have any documents.
              </p>
              <p>Navigate to the top right to import a file.</p>
            </div>
          )}
        </div>
        <div className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
          file manager
        </div>
        <div className="absolute right-[-25px] top-[-30px]">
          <div className="bg-white py-2 px-2">
            <FileUploadModal refetchFileList={fetchProjectFiles} />
          </div>
        </div>
      </div>
    </div>
  );
};

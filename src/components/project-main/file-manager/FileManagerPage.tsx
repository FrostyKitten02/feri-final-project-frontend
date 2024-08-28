import { useEffect, useState } from "react";
import { ProjectFilesResponse } from "../../../../client";
import { FileUploadModal } from "./FileUploadModal";
import { useRequestArgs } from "../../../util/CustomHooks";
import { useParams } from "react-router-dom";
import { toastWarning } from "../../toast-modals/ToastFunctions";
import { projectAPI } from "../../../util/ApiDeclarations";
import { Spinner } from "flowbite-react";
import { FaRegFileAlt } from "react-icons/fa";
import TextUtil from "../../../util/TextUtil";
import { DeleteFileModal } from "./DeleteFileModal";
import Popover from "../../template/popover-menu/Popover";
import { PopoverItem } from "../../../interfaces";
import { BsThreeDots } from "react-icons/bs";
import mime from "mime-types";
import { PreviewFileModal } from "./PreviewFileModal";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ModalText } from "../../template/modal/CustomModal";
import { toast } from "react-toastify";
import RequestUtil from "../../../util/RequestUtil";
import { FaRegFolderOpen } from "react-icons/fa";

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
          await requestArgs.getRequestArgs()
        );
        if (response.status === 200) {
          setProjectFiles(response.data);
        }
      } else {
        toastWarning("Project id not found");
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (
    fileId?: string,
    fileName?: string,
    fileType?: string
  ): Promise<void> => {
    await toast.promise(
      async () => {
        if (fileId) {
          const response = await projectAPI.download(fileId, {
            ...(await requestArgs.getRequestArgs()),
            responseType: "blob",
          });
          if (response.status === 200) {
            const blob = response.data;

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              fileName || `steer_file_download.${fileType}`
            );
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
          } else {
            console.error();
          }
        } else {
          throw new Error("Project id not found.");
        }
      },
      {
        pending: "Downloading...",
        success: "Files successfully downloaded.",
        error: "An error occured during the download.",
      },
      {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 2000,
      }
    );
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
            <>
              <div className="flex flex-col h-full">
                <div className="mt-4">
                  <ModalText showIcon={true}>
                    Note: Document preview available for{" "}
                    <span className="font-semibold">PDF</span> files only.
                  </ModalText>
                </div>
                <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr] pt-4 pb-4 px-3">
                  <div className="flex justify-end items-center" />
                  <div className="flex items-center justify-start">
                    <div className="text-sm text-gray-600 font-semibold text-start">
                      FILE NAME
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="text-sm text-gray-600 font-semibold text-center">
                      FORMAT
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="text-sm text-gray-600 font-semibold text-center">
                      FILE SIZE
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="text-sm text-gray-600 font-semibold text-center">
                      UPLOAD DATE
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="text-sm text-gray-600 font-semibold text-center">
                      ACTION
                    </div>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto px-3">
                  <div className="rounded-2xl border border-solid border-gray-200 bg-white divide-y divide-solid divide-gray-200">
                    {projectFiles.files.map((file) => {
                      const fileType =
                        mime.extension(file.contentType ?? "") || undefined;
                      const popoverItems: PopoverItem[] = [];

                      if (fileType === "pdf") {
                        popoverItems.push({
                          component: (
                            <PreviewFileModal
                              fileId={file.id}
                              fileName={file.originalFileName}
                              fileType={fileType}
                            />
                          ),
                          label: "Preview",
                        });
                      }

                      popoverItems.push({
                        component: (
                          <button
                            type="button"
                            onClick={() =>
                              downloadFile(
                                file.id,
                                file.originalFileName,
                                fileType
                              )
                            }
                          ></button>
                        ),
                        label: "Download",
                      });

                      popoverItems.push({
                        component: (
                          <DeleteFileModal
                            file={file}
                            refetchFileList={fetchProjectFiles}
                          />
                        ),
                        label: "Delete",
                      });

                      return (
                        <div
                          className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr] py-6"
                          key={file.id}
                        >
                          <div className="flex justify-end items-center">
                            <FaRegFileAlt
                              className={`size-6 ${TextUtil.returnFileTypeColor(
                                file.contentType ?? ""
                              )}`}
                            />
                          </div>
                          <div className="flex flex-row items-center justify-start px-4 overflow-hidden">
                            <p className="text-normal font-semibold truncate text-start">
                              {file.originalFileName}
                            </p>
                          </div>
                          <div className="flex items-center justify-center">
                            <p className="text-normal text-muted">
                              .{mime.extension(file.contentType ?? "")}
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
                          <div className="flex items-center justify-center relative">
                            <Popover
                              items={popoverItems}
                              height={popoverItems.length > 2 ? 36 : 28}
                              width={36}
                              position="bottom"
                              triggerIcon={
                                <BsThreeDots className="size-6 fill-gray-700 hover:fill-primary transition delay-50" />
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <FaRegFolderOpen className="fill-gray-300 size-44 pb-6" />
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
        <div className="absolute right-[-35px] top-[-30px]">
          <div className="bg-white py-2 px-2">
            <FileUploadModal refetchFileList={fetchProjectFiles} />
          </div>
        </div>
      </div>
    </div>
  );
};

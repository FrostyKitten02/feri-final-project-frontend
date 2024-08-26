import {useEffect, useState} from "react";
import {useRequestArgs} from "../../../util/CustomHooks";
import {PreviewFileModalProps} from "../../../interfaces";
import ModalPortal from "../../template/modal/ModalPortal";
import {
  CustomModal,
  CustomModalBody,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import DocViewer, {DocViewerRenderers, IDocument,} from "@cyntler/react-doc-viewer";

export const PreviewFileModal = ({
  fileId,
  fileName,
  fileType,
  isOpen,
  onClose,
}: PreviewFileModalProps) => {
  const requestArgs = useRequestArgs();
  const [requestHeaders, setRequestHeaders] = useState<Record<string, string> | null>(null)
  const [documents, setDocuments] = useState<IDocument[]>([]);

  useEffect(() => {
    setHeaders()
  }, [])

  useEffect(() => {
    if (isOpen) {
      constructFileDownloadURI();
    }
  }, [isOpen]);

  const setHeaders = async function () {
    setRequestHeaders((await requestArgs.getRequestArgs()).headers as Record<string, string>)
  }

  const handleModalClose = (): void => {
    onClose?.();
    setDocuments([]);
  };

  const constructFileDownloadURI = () => {
    let appBaseURL: string = "";
    if (import.meta.env.VITE_APP_BASE_URL) {
      appBaseURL = import.meta.env.VITE_APP_BASE_URL;
    } else if (import.meta.env.VITE_BACKEND_BASE_URL) {
      appBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;
    }
    setDocuments([
      {
        uri: `${appBaseURL}/project/file/${fileId}`,
        fileName: fileName,
        fileType: fileType,
      },
    ]);
  };

  if (!isOpen || requestHeaders == null) return false;

  console.log(requestHeaders, "HEADERS ")
  return (
    <ModalPortal>
      <CustomModal
        closeModal={handleModalClose}
        modalWidth="750px"
        modalHeight="700px"
      >
        <CustomModalHeader handleModalClose={handleModalClose}>
          <ModalTitle>document preview</ModalTitle>
          <ModalText>
            <div className="flex items-center text-black text-md">
              <div>You are previewing</div>
              <div className="font-semibold pl-[5px]">{fileName}</div>
              <div>.</div>
            </div>
          </ModalText>
        </CustomModalHeader>
        <CustomModalBody>
          <div className="overflow-auto mb-24">
            <DocViewer
              style={{ height: "500px" }}
              prefetchMethod="GET"
              requestHeaders={requestHeaders}
              documents={documents}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableFileName: true,
                  disableHeader: true,
                },
                pdfVerticalScrollByDefault: true,
                pdfZoom: {
                  defaultZoom: 1.4,
                  zoomJump: 0.1,
                },
              }}
            />
          </div>
        </CustomModalBody>
      </CustomModal>
    </ModalPortal>
  );
};

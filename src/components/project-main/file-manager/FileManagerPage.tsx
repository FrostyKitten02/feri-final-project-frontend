import { FileUploadModal } from "./FileUploadModal";

export const FileManagerPage = () => {
  return (
    <div className="flex w-full h-full p-10">
      <div
        className={`relative flex flex-col  flex-grow border-[1px] border-gray-200 border-solid rounded-[20px] px-5`}
      >
        <div className="w-full h-full px-12 rounded-bl-[20px]">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-4 pt-8 pb-4">
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
          </div>
        </div>
        <div className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
          file manager
        </div>
        <div className="absolute right-[-25px] top-[-30px]">
          <div className="bg-white py-2">
            <FileUploadModal />
          </div>
        </div>
      </div>
    </div>
  );
};

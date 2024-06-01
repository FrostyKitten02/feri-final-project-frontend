import { useState } from "react";
import {} from "../../../../temp_ts";
import { WorkPackageListing } from "./WorkPackageList";

export default function WorkPackagePage() {
  const [workPackageModalOpen, setWorkPackageModalOpen] =
    useState<boolean>(false);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full px-12 py-6 w-full">
        <div className="flex flex-row py-6">
          <div className="flex justify-start w-2/3 items-center">
            <h1 className="font-bold text-3xl">Work packages</h1>
          </div>
          <div className="flex w-1/3 justify-end items-center">
            <button
              onClick={() => setWorkPackageModalOpen(true)}
              className="flex justify-center items-center bg-rose-500 text-white rounded-lg h-12 space-x-4 w-52"
            >
              <span className="font-semibold text-2xl">+</span>
              <span className="font-semibold text-lg">Add work package</span>
            </button>
          </div>
        </div>
        <div
          className={`flex flex-col py-12 px-12 mt-6 border-2 border-solid rounded-2xl border-gray-200 w-full h-full overflow-auto`}
        >
          <WorkPackageListing
            isFormOpen={workPackageModalOpen}
            setIsFormOpen={setWorkPackageModalOpen}
          />
        </div>
      </div>
    </div>
  );
}

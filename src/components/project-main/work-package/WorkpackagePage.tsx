import { useState } from "react";
import {} from "../../../../temp_ts";
import { WorkPackageListing } from "./WorkPackageListing";
import PackagePlusIcon from "../../../assets/icons/package-plus-svgrepo-com.svg?react";

export default function WorkPackagePage() {
  const [workPackageModalOpen, setWorkPackageModalOpen] =
    useState<boolean>(false);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-row h-full flex-grow">
        <div
          className={`flex flex-col py-12 px-12 border-r-2 border-solid border-gray-200 w-full h-full overflow-y-scroll`}
        >
          <WorkPackageListing
            isFormOpen={workPackageModalOpen}
            setIsFormOpen={setWorkPackageModalOpen}
          />
        </div>
        <div className="flex px-6 items-start pt-6">
          <button
            onClick={() => setWorkPackageModalOpen(true)}
          >
            <PackagePlusIcon className="stroke-black size-12 hover:stroke-primary transition delay-50"/>
          </button>
        </div>
      </div>
    </div>
  );
}

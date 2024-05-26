import { useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import WorkPackageForm from "./WorkpackageForm";
import { CreateWorkPackageRequest, WorkPackageDto } from "../../../../temp_ts";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import { workPackageAPI, projectAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { WorkPackageFormFields } from "../../../types/forms/formTypes";
import {
  WorkPackageItemProps,
  WorkPackageListingProps,
} from "../../../interfaces";
import TaskModalForm from "./TaskModalForm";

export default function WorkPackagePage() {
  const { projectId } = useParams();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [workPackages, setWorkPackages] = useState<
    WorkPackageDto[] | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();

  const close = (): void => {
    setModalOpen(false);
  };

  const open = (): void => {
    setModalOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchWorkPackagesForProject().then(() => setIsLoading(false));
  }, [projectId]);

  const fetchWorkPackagesForProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200) {
          setWorkPackages(
            response.data.projectDto && response.data.projectDto.workPackages
          );
        }
      } else {
        toastError("Project id not found!");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const onSubmit: SubmitHandler<WorkPackageFormFields> = async (
    data
  ): Promise<void> => {
    // onSUbmit function passed to the form (react hook form)
    const workPackage: CreateWorkPackageRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      isRelevant: data.isRelevant,
      projectId: projectId,
    };

    try {
      if (projectId) {
        const response = await workPackageAPI.createWorkPackage(
          workPackage,
          requestArgs
        );
        if (response.status === 201) {
          fetchWorkPackagesForProject();
          toastSuccess(
            "Work package " +
              data.title +
              " was successfully added to the project!"
          );
        }
      } else {
        toastError("Project id not found");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full px-12 py-6 w-full">
        <div className="flex flex-row py-6">
          <div className="flex justify-start w-2/3 items-center">
            <h1 className="font-bold text-3xl">Work packages</h1>
          </div>
          <div className="flex w-1/3 justify-end items-center">
            <button onClick={() => setIsFormOpen(true)}>
              <div className="flex justify-center items-center bg-rose-500 text-white rounded-lg h-12 space-x-4 w-52">
                <p className="font-semibold text-2xl">+</p>
                <p className="font-semibold text-lg">Add work package</p>
              </div>
            </button>
          </div>
        </div>
        <WorkPackageForm
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onSubmit={onSubmit}
        />
        {modalOpen && <TaskModalForm handleClose={close} />}
        <div
          className={`flex flex-col py-12 px-12 mt-6 border-2 border-solid rounded-2xl border-gray-200 w-full h-full ${
            isFormOpen ? "" : "z-10"
          } overflow-auto`}
        >
          <WorkPackageListing
            isLoading={isLoading}
            allWorkPackages={workPackages}
            onClick={() => (modalOpen ? close() : open())}
          />
        </div>
      </div>
    </div>
  );
}

const WorkPackageListing: FC<WorkPackageListingProps> = ({
  isLoading,
  allWorkPackages,
  onClick,
}) => {
  return (
    <div className="flex-grow">
      <div className="flex flex-col h-full">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center font-bold text-3xl">
            <h1>Loading work packages...</h1>
          </div>
        ) : allWorkPackages && allWorkPackages.length > 0 ? (
          <div className="flex-col flex-grow gap-y-10 ">
            {allWorkPackages.map((workPackage) => (
              <WorkPackageItem workPackage={workPackage} onClick={onClick} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col w-full justify-center items-center font-bold text-3xl space-y-4">
            <h1>No work packages found...</h1>
            <p className="text-base text-gray-700">
              Click the "Add work package" button to add a new work package.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkPackageItem: FC<WorkPackageItemProps> = ({
  workPackage,
  onClick,
}) => {
  return (
    workPackage && (
      <div key={workPackage.title} className="p-5 h-72">
        <div className="flex hover:bg-gray-100 items-center rounded-xl p-6 h-full border border-gray-200 border-solid shadow-xl">
          <div className="w-full h-full">
            <div className="border-l-4 border-solid border-rose-500 w-full">
              <div
                className={`flex ${
                  workPackage.isRelevant ? "bg-green-500" : "bg-red-700"
                } w-fit px-2 rounded-lg ml-2 justify-start items-center`}
              >
                <div className="font-semibold italic text-white text-sm">
                  Relevant: {workPackage.isRelevant ? <p>YES</p> : <p>NO</p>}
                </div>
              </div>
              <h1 className="font-bold pl-4 text-xl">{workPackage.title}</h1>
            </div>
            <div className="flex flex-row pt-4 pb-4 gap-x-12 w-full">
              <div>
                <p className="font-semibold text-gray-700">Start:</p>
                <p className="font-semibold">{workPackage.startDate}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">End:</p>
                <p className="font-semibold">{workPackage.endDate}</p>
              </div>
            </div>
            <div
              onClick={onClick}
              className="flex items-center justify-center cursor-pointer bg-rose-500 text-white w-24"
            >
              <p>Add task</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

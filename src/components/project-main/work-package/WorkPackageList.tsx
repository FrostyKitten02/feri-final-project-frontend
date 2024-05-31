import { FC } from "react";
import {
  WorkPackageItemProps,
  WorkPackageListingProps,
} from "../../../interfaces";
import { TaskListing } from "./TaskList";

export const WorkPackageListing: FC<WorkPackageListingProps> = ({
  isLoading,
  allWorkPackages,
  onClick,
  allWorkPackageTasks,
  onAssignClick
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
              <div key={workPackage.id}>
                <WorkPackageItem
                  workPackage={workPackage}
                  onClick={onClick}
                  allWorkPackageTasks={allWorkPackageTasks}
                  onAssignClick={onAssignClick}
                />
              </div>
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
  allWorkPackageTasks,
  onAssignClick
}) => {
  const tasksForWorkPackage = allWorkPackageTasks.filter(
    (task) => task.workPackageId === workPackage?.id
  ); // filter from all tasks for workpackage

  return (
    workPackage && (
      <div key={workPackage.id} className="p-5 h-72">
        <div className="flex hover:bg-gray-100 items-center rounded-xl p-10 h-full border border-gray-200 border-solid shadow-xl">
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
            <button
              onClick={() => onClick(workPackage.id)}
              className="flex items-center justify-center bg-rose-500 text-white w-24"
            >
              Add task
            </button>
          </div>
          <div className="w-1/2 h-full">
            <TaskListing allTasks={tasksForWorkPackage} onAssignClick={onAssignClick}/>
          </div>
        </div>
      </div>
    )
  );
};

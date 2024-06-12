import { FC } from "react";
import { WorkPackageItemProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import { HiCalendar } from "react-icons/hi";
import PlusIcon from "../../../assets/icons/plus-large-svgrepo-com.svg?react";
import { TaskListing } from "./TaskListing";

export const WorkPackageItem: FC<WorkPackageItemProps> = ({
  workPackage,
  onClick,
}) => {
  const progress: number = TextUtil.returnProgress(
    workPackage?.startDate,
    workPackage?.endDate
  );

  return (
    workPackage && (
      <div key={workPackage.id} className="p-5 h-fit">
        <div className="flex rounded-xl h-full border border-gray-200 border-solid shadow-xl">
          <div className="flex flex-col w-1/3 flex-grow p-10">
            <div className="flex justify-between items-center">
              <div className="flex flex-row items-center">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                  <HiCalendar className="h-4 w-4 fill-primary" />
                </div>
                <div className="px-2 italic text-xs text-muted">
                  {TextUtil.refactorDate(workPackage.startDate)}
                </div>
              </div>
              {workPackage.isRelevant ? (
                <div
                  className={`flex bg-green w-fit px-2 rounded-lg ml-2 justify-start items-center`}
                >
                  <p className="font-semibold italic text-sm uppercase">
                    RELEVANT
                  </p>
                </div>
              ) : (
                <div
                  className={`flex bg-red-500 w-fit px-2 rounded-lg ml-2 justify-start items-center`}
                >
                  <p className="font-semibold italic text-sm uppercase">
                    IRRELEVANT
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-grow">
              <div className="w-[1px] bg-gray-200 mx-[12px] my-2" />
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-center font-bold text-2xl flex-grow">
                  {workPackage.title}
                </div>
                <div className="text-end">{progress.toFixed(0) + `%`}</div>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                  <HiCalendar className="h-4 w-4 fill-primary" />
                </div>
                <div className="px-2 italic text-xs text-muted">
                  {TextUtil.refactorDate(workPackage.endDate)}
                </div>
              </div>
              <div className="flex-grow ml-4 p-0">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-2/3 h-full bg-gray-100 p-10">
            {workPackage.tasks?.length && workPackage.tasks.length > 0 ? (
              <div>
                <div className="flex w-full pb-12">
                  <div className="flex justify-start w-1/2 font-semibold text-2xl">
                    Tasks
                  </div>
                  <div className="flex w-1/2 justify-end">
                    <button
                      onClick={() => onClick(workPackage.id, workPackage.title)}
                      className="flex items-center justify-center bg-primary rounded-lg text-white w-28 gap-x-2"
                    >
                      <PlusIcon className="stroke-white size-4" />
                      <span className="text-sm">New task</span>
                    </button>
                  </div>
                </div>
                <div className="h-full">
                  <TaskListing workPackageId={workPackage.id} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-y-6">
                <h1 className="font-semibold text-xl">
                  No tasks found for this work package.
                </h1>
                <p>Once added, they will appear here.</p>
                <div className="flex">
                    <button
                      onClick={() => onClick(workPackage.id, workPackage.title)}
                      className="flex items-center justify-center bg-primary rounded-lg text-white w-28 h-8 gap-x-2"
                    >
                      <PlusIcon className="stroke-white size-4" />
                      <span className="text-sm">New task</span>
                    </button>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

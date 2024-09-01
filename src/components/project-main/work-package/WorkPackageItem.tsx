import { FC } from "react";
import { PopoverItem, WorkPackageItemProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import { HiCalendar } from "react-icons/hi";
import { TaskListing } from "./TaskListing";
import { ProgressBar } from "@tremor/react";
import WorkPackageModal from "./WorkPackageModal";
import { DeleteWorkPackageModal } from "./DeleteWorkPackageModal";
import TaskModal from "./TaskModal";
import Popover from "../../template/popover-menu/Popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Label } from "flowbite-react";

export const WorkPackageItem: FC<WorkPackageItemProps> = ({
  workPackage,
  onSuccess,
  projectDetails,
}) => {
  const progress: number = TextUtil.returnProgress(
    workPackage?.startDate,
    workPackage?.endDate
  );
  const daysLeft: string = TextUtil.returnDaysLeft(workPackage?.endDate);
  const { text, animation, bgColor, color } =
    TextUtil.returnProgressText(progress);

  const popoverItems: PopoverItem[] = [
    {
      component: (
        <WorkPackageModal
          onSuccess={onSuccess}
          workpackage={workPackage}
          projectDetails={projectDetails}
        />
      ),
      label: "Edit",
    },
    {
      component: (
        <DeleteWorkPackageModal
          workpackage={workPackage}
          onSuccess={onSuccess}
        />
      ),
      label: "Delete",
    },
  ];

  return (
    workPackage && (
      <div
        key={workPackage.id}
        className="flex rounded-xl border border-gray-200 border-solid mt-8"
      >
        <div className="flex flex-col w-1/3 rounded-l-xl">
          <div className="flex flex-col flex-grow p-5">
            <div className="flex items-center">
              <div className="flex flex-row items-center">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                  <HiCalendar className="h-4 w-4 fill-primary" />
                </div>
                <div className="px-2 italic text-xs text-muted">
                  {TextUtil.refactorDate(workPackage.startDate)}
                </div>
              </div>
              <div className="flex-grow h-[1px] bg-gray-200 mx-2" />
              <div className="flex flex-row items-center">
                <div className="px-2 italic text-xs text-muted">
                  {TextUtil.refactorDate(workPackage.endDate)}
                </div>
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                  <HiCalendar className="h-4 w-4 fill-primary" />
                </div>
              </div>
            </div>
            <div className="flex flex-grow">
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-center font-bold text-2xl flex-grow py-6 text-center">
                  {workPackage.title}
                </div>
              </div>
            </div>
            <div className="flex flex-col pb-4">
              <div className="flex-grow p-0">
                <ProgressBar value={progress} color={color} className="py-2" />
              </div>
              <div className="font-normal text-sm text-muted flex flex-row gap-x-2 justify-start items-center">
                <div
                  className={`${bgColor} rounded-full w-2 h-2 ${animation}`}
                />
                <p className="uppercase font-semibold text-black">{`${text}: ${Math.floor(
                  progress
                ).toString()}%`}</p>
                <p>({daysLeft} days left)</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <div className="w-[7%] h-[1px] bg-gray-300" />
                <Label className="px-2 uppercase text-muted">
                  work package details
                </Label>
                <div className="flex-grow h-[1px] bg-gray-300" />
              </div>
              <div className="flex flex-row gap-x-2 items-center justify-center pt-2">
                <p className="font-semibold">ASSIGNED PM: </p>
                <p className="text-2xl font-semibold">
                  {workPackage.assignedPM}
                </p>
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-gray-200" />
          <div className="flex flex-row items-center px-5 py-4">
            <div className="flex flex-row items-center gap-x-2 flex-grow">
              <div>
                {workPackage.isRelevant ? (
                  <div
                    className={`flex bg-custom-green w-fit px-2 rounded-lg ml-2 justify-start items-center`}
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
                      NOT RELEVANT
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-center w-[20px] relative">
              <Popover
                items={popoverItems}
                width={40}
                height={28}
                position="top-right"
                triggerIcon={
                  <BsThreeDotsVertical className="size-6 fill-gray-700 hover:fill-primary transition delay-50" />
                }
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-col w-2/3 rounded-r-xl p-5 border-solid border-l border-gray-200">
          {workPackage.tasks && workPackage.tasks.length > 0 ? (
            <>
              <div className="flex flex-col h-full">
                <div className="flex w-full pb-5">
                  <div className="flex w-full justify-end">
                    {
                      <TaskModal
                        onSuccess={onSuccess}
                        workpackage={workPackage}
                      />
                    }
                  </div>
                </div>
                <TaskListing workpackage={workPackage} onSuccess={onSuccess} />
              </div>
              <div className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
                TASKS
              </div>
            </>
          ) : workPackage.isRelevant ? (
            <div className="flex flex-col h-full items-center gap-y-6 justify-center">
              <h1 className="font-semibold text-xl">
                No tasks found for this work package.
              </h1>
              <p>Once added, they will appear here.</p>
              {<TaskModal onSuccess={onSuccess} workpackage={workPackage} />}
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <h1 className="font-semibold text-lg text-black/30">
                Tasks are disabled for irrelevant work packages.
              </h1>
            </div>
          )}
        </div>
      </div>
    )
  );
};

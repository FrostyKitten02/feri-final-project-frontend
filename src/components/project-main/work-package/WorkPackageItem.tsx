import { FC } from "react";
import { WorkPackageItemProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import { HiCalendar } from "react-icons/hi";
import { TaskListing } from "./TaskListing";
import { ProgressBar } from "@tremor/react";
import TaskModal from "./TaskModal";
import WorkPackageModal from "./WorkPackageModal";
import { LuClipboardEdit } from "react-icons/lu";
import DeleteModal from "../../template/modal/DeleteModal";

export const WorkPackageItem: FC<WorkPackageItemProps> = ({
  workPackage,
  handleAddTask,
  handleEditWorkPackage,
  projectDetails,
}) => {
  const progress: number = TextUtil.returnProgress(
    workPackage?.startDate,
    workPackage?.endDate
  );
  /*const duration: number = TextUtil.returnDuration(
    workPackage?.startDate,
    workPackage?.endDate
  );*/
  const daysLeft: string = TextUtil.returnDaysLeft(workPackage?.endDate);
  const { text, color } = TextUtil.returnProgressText(progress);

  return (
    workPackage && (
      <div key={workPackage.id} className="py-5 h-fit">
        <div className="flex rounded-xl h-full border border-gray-200 border-solid shadow-xl">
          <div className="flex flex-col w-1/3 rounded-l-xl">
            <div className="flex flex-col flex-grow p-5">
              <div className="flex justify-between items-center">
                <div className="flex flex-row items-center">
                  <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                    <HiCalendar className="h-4 w-4 fill-primary" />
                  </div>
                  <div className="px-2 italic text-xs text-muted">
                    {TextUtil.refactorDate(workPackage.startDate)}
                  </div>
                </div>
                <div className="flex flex-row gap-x-1 items-center">
                  <LuClipboardEdit className="size-5 stroke-black" />
                  {workPackage.tasks?.length === undefined || 0 ? (
                    <p className="text-lg font-mono">0</p>
                  ) : (
                    <p className="text-lg font-mono">
                      {workPackage.tasks?.length}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-grow">
                <div className="w-[1px] bg-gray-200 mx-[12px] my-2" />
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-center font-bold text-2xl flex-grow py-6">
                    {workPackage.title}
                  </div>
                  <div className="text-end font-bold font-mono">
                    <span>{daysLeft} days left</span>
                  </div>
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
                  <ProgressBar value={progress} />
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-gray-200" />
            <div className="flex flex-row items-center px-5 py-4">
              <div className="flex flex-row items-center gap-x-2 w-2/3">
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
                        IRRELEVANT
                      </p>
                    </div>
                  )}
                </div>
                <div
                  className={`flex ${color} w-fit px-2 rounded-lg justify-start items-center`}
                >
                  <p className="font-semibold italic text-sm uppercase">
                    {text}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-end w-1/3 gap-x-4">
                <WorkPackageModal
                  edit={true}
                  handleAddWorkPackage={handleEditWorkPackage}
                  title={workPackage.title}
                  startDate={workPackage.startDate}
                  endDate={workPackage.endDate}
                  isRelevant={workPackage.isRelevant}
                  assignedPM={workPackage.assignedPM}
                  projectDetails={projectDetails}
                  workPackageId={workPackage.id}
                />
                <DeleteModal title={workPackage.title} />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-2/3 bg-gray-200 rounded-r-xl p-5">
            {workPackage.tasks?.length && workPackage.tasks.length > 0 ? (
              <div>
                <div className="flex w-full pb-12">
                  <div className="flex justify-start w-1/2 font-semibold text-2xl">
                    Tasks
                  </div>
                  <div className="flex w-1/2 justify-end">
                    <TaskModal
                      handleAddTask={handleAddTask}
                      workPackageId={workPackage.id}
                      workPackageTitle={workPackage.title}
                      workPackageStartDate={workPackage.startDate}
                      workPackageEndDate={workPackage.endDate}
                      disabled={false}
                      edit={false}
                    />
                  </div>
                </div>
                <TaskListing
                  tasks={workPackage.tasks}
                  handleEditTask={handleAddTask}
                  workPackageTitle={workPackage.title}
                  workPackageStartDate={workPackage.startDate}
                  workPackageEndDate={workPackage.endDate}
                />
              </div>
            ) : workPackage.isRelevant ? (
              <div className="flex flex-col h-full items-center gap-y-6 justify-center">
                <h1 className="font-semibold text-xl">
                  No tasks found for this work package.
                </h1>
                <p>Once added, they will appear here.</p>
                <TaskModal
                  handleAddTask={handleAddTask}
                  workPackageId={workPackage.id}
                  workPackageTitle={workPackage.title}
                  workPackageStartDate={workPackage.startDate}
                  workPackageEndDate={workPackage.endDate}
                  disabled={false}
                  edit={false}
                />
              </div>
            ) : (
              <div className="flex flex-col h-full items-center gap-y-6 justify-center">
                <h1 className="font-semibold text-lg text-black/30">
                  Tasks are disabled for irrelevant work packages.
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

import { FC, useMemo, useState } from "react";
import { TaskListingProps } from "../../../interfaces";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { TaskItem } from "./TaskItem";

export const TaskListing: FC<TaskListingProps> = ({
  workpackage,
  onSuccess,
}) => {
  const [showIrrelevant, setShowIrrelevant] = useState<boolean>(false);
  const sortedTasksByDate = useMemo(() => {
    if (workpackage.tasks) {
      return workpackage?.tasks.slice().sort((a, b) => {
        const fallbackDate = new Date().getTime();
        const dateA = a.startDate
          ? new Date(a.startDate).getTime()
          : fallbackDate;
        const dateB = b.startDate
          ? new Date(b.startDate).getTime()
          : fallbackDate;
        return dateA - dateB;
      });
    } else return [];
  }, [workpackage.tasks]);
  const irrelevantTasks = sortedTasksByDate.filter((task) => !task.isRelevant);

  const handleToggleIrrelevant = () => {
    setShowIrrelevant((prev) => !prev);
  };
  return (
    <>
      {showIrrelevant ? (
        <div className="flex justify-end pb-2 gap-x-2">
          <button
            onClick={handleToggleIrrelevant}
            className="flex flex-row gap-x-2"
          >
            <FaRegEye className="size-5" />
            <p className="font-semibold text-sm">Hide irrelevant</p>
          </button>
        </div>
      ) : (
        <div className="flex justify-end pb-2 gap-x-2">
          <button
            disabled={irrelevantTasks.length === 0}
            onClick={() => setShowIrrelevant(true)}
            className="flex flex-row gap-x-2"
          >
            <FaRegEyeSlash
              className={`size-5 ${
                irrelevantTasks.length === 0 ? `fill-gray-400` : `fill-black`
              }`}
            />
            <p
              className={`font-semibold text-sm ${
                irrelevantTasks.length === 0 ? `text-gray-400` : `text-black`
              }`}
            >
              Show all
            </p>
          </button>
        </div>
      )}
      <div className="flex flex-col justify-center h-full">
        {sortedTasksByDate.every((task) => !task.isRelevant) &&
        !showIrrelevant ? (
          <div className="h-full flex flex-col items-center justify-center">
            <FaRegEyeSlash className="size-12 fill-muted" />
            <p className="text-md text-muted font-semibold">
              All irrelevant tasks are hidden
            </p>
          </div>
        ) : (
          <div className="grid rounded-md items-center gap-y-2">
            {sortedTasksByDate.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                showIrrelevant={showIrrelevant}
                onSuccess={onSuccess}
                workpackage={workpackage}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

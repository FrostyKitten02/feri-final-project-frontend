import { FC, useMemo, useState } from "react";
import { TaskListingProps } from "../../../interfaces";
//import { useParams } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { TaskItem } from "./TaskItem";

export const TaskListing: FC<TaskListingProps> = ({
  tasks,
  handleEditTask,
  workPackageTitle,
  workPackageStartDate,
  workPackageEndDate,
}) => {
  const [showIrrelevant, setShowIrrelevant] = useState<boolean>(false);

  const sortedTasksByDate = useMemo(() => {
    return tasks.sort((a, b) => {
      const fallbackDate = new Date(Date.now()).getTime();
      const dateA = a.startDate
        ? new Date(a.startDate).getTime()
        : fallbackDate;
      const dateB = b.startDate
        ? new Date(b.startDate).getTime()
        : fallbackDate;
      return dateA - dateB;
    });
  }, [tasks]);

  const irrelevantTasks = sortedTasksByDate.filter((task) => !task.isRelevant);

  /*
  useEffect(() => {
    //setIsLoading(true);
    fetchWorkPackagesAndTasksForProject(); //.then(() => setIsLoading(false));
  }, [projectId]);
  */

  return (
    <div>
      {showIrrelevant ? (
        <div className="flex justify-end pb-6 gap-x-2">
          <button
            onClick={() => setShowIrrelevant(false)}
            className="flex flex-row gap-x-2"
          >
            <FaRegEye className="size-5" />
            <p className="font-semibold text-sm">Hide irrelevant</p>
          </button>
        </div>
      ) : (
        <div className="flex justify-end pb-6 gap-x-2">
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
      {sortedTasksByDate.length > 0 && (
        <div className="h-full grid border border-solid border-gray-200 rounded-md shadow-md overflow-hidden bg-white">
          {sortedTasksByDate.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showIrrelevant={showIrrelevant}
              handleEditTask={handleEditTask}
              workPackageTitle={workPackageTitle}
              workPackageStartDate={workPackageStartDate}
              workPackageEndDate={workPackageEndDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

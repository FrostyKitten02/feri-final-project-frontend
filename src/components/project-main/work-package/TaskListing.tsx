import { FC, useContext, useState } from "react";
import { TaskItemProps, TaskListingProps } from "../../../interfaces";
//import { useParams } from "react-router-dom";
import { TaskContext } from "../../../contexts";
import TextUtil from "../../../util/TextUtil";
import { HiOutlineTrash } from "react-icons/hi2";
import { FiEdit3 } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export const TaskListing: FC<TaskListingProps> = ({ workPackageId }) => {
  //const { projectId } = useParams();

  const [showIrrelevant, setShowIrrelevant] = useState<boolean>(false);

  // CONTEXT
  const taskContext = useContext(TaskContext);
  if (!taskContext) {
    throw new Error("TaskContext is not provided.");
  }
  const { tasks } = taskContext;

  const tasksForWorkPackage = tasks?.filter(
    (task) => task.workPackageId === workPackageId
  ); // filter from all tasks for workpackage
  const irrelevantTasks = tasks.filter(
    (task) => task.workPackageId === workPackageId && !task.isRelevant
  );

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
            <FaRegEye className="size-6" />
            <p className="font-semibold">Hide irrelevant</p>
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
              className={`size-6 ${
                irrelevantTasks.length === 0 ? `fill-gray-400` : `fill-black`
              }`}
            />
            <p
              className={`font-semibold ${
                irrelevantTasks.length === 0 ? `text-gray-400` : `text-black`
              }`}
            >
              Show all
            </p>
          </button>
        </div>
      )}
      {tasksForWorkPackage.length > 0 && (
        <div className="h-full grid border border-solid border-gray-200 rounded-md shadow-md overflow-hidden bg-white">
          {tasksForWorkPackage.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showIrrelevant={showIrrelevant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskItem: FC<TaskItemProps> = ({ task, showIrrelevant }) => {
  return (
    <AnimatePresence>
      {(showIrrelevant || task?.isRelevant) && (
        <motion.div
          className={`grid grid-cols-[5px_2fr_2fr_2fr] items-center border-b border-gray-200 border-solid mb-[-1px]`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`${task?.isRelevant ? `bg-green` : `bg-red-600`} h-full`}
          />
          <motion.div className="flex items-center justify-center font-medium py-4">
            {task?.title}
          </motion.div>
          <motion.div className="flex items-center justify-center font-medium py-4">
            {TextUtil.refactorDate(task?.startDate)} -{" "}
            {TextUtil.refactorDate(task?.endDate)}
          </motion.div>
          <motion.div className="flex items-center justify-center gap-x-4 py-4">
            <button>
              <FiEdit3 className="size-6 stroke-gray-700" />
            </button>
            <button>
              <HiOutlineTrash className="size-6 stroke-red-500" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

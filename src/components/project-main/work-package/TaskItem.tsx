import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { TaskItemProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import TaskModal from "./TaskModal";

export const TaskItem: FC<TaskItemProps> = ({
  task,
  showIrrelevant,
  handleEditTask,
  workPackageTitle,
  workPackageStartDate,
  workPackageEndDate,
}) => {
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
            className={`${
              task?.isRelevant ? `bg-custom-green` : `bg-red-600`
            } h-full`}
          />
          <motion.div className="flex items-center justify-center font-medium py-4">
            {task?.title}
          </motion.div>
          <motion.div className="flex items-center justify-center font-medium py-4">
            {TextUtil.refactorDate(task?.startDate)} -{" "}
            {TextUtil.refactorDate(task?.endDate)}
          </motion.div>
          <motion.div className="flex items-center justify-center gap-x-4 py-4">
            <TaskModal
              handleAddTask={handleEditTask}
              disabled={false}
              edit={true}
              taskTitle={task?.title}
              taskStartDate={task?.startDate}
              taskEndDate={task?.endDate}
              taskIsRelevant={task?.isRelevant}
              taskId={task?.id}
              workPackageTitle={workPackageTitle}
              workPackageStartDate={workPackageStartDate}
              workPackageEndDate={workPackageEndDate}
            />
            <button>
              <HiOutlineTrash className="size-6 stroke-red-500" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { PopoverItem, TaskItemProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import TaskModal from "./TaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { BsThreeDots } from "react-icons/bs";
import Popover from "../../template/popover-menu/Popover";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi2";

export const TaskItem: FC<TaskItemProps> = ({
  task,
  showIrrelevant,
  onSuccess,
  workpackage,
}) => {
  if (!task) return null;

  const progress = TextUtil.returnProgress(task.startDate, task.endDate);
  const { text, color, animation } = TextUtil.returnProgressText(progress);

  const popoverItems: PopoverItem[] = [
    {
      component: (
        <TaskModal
          onSuccess={onSuccess}
          workpackage={workpackage}
          task={task}
        />
      ),
      icon: <FiEdit3 className="size-5" />,
      label: "Edit task",
    },
    {
      component: <DeleteTaskModal task={task} onSuccess={onSuccess} />,
      icon: <HiOutlineTrash className="size-5" />,
      label: "Delete task",
    },
  ];

  return (
    <AnimatePresence>
      {(showIrrelevant || task?.isRelevant) && (
        <motion.div
          className={`grid grid-cols-[5px_0.5fr_1fr_1fr_0.5fr] items-center border-b border-gray-200 border-solid mb-[-1px]`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`${
              task?.isRelevant ? `bg-custom-green` : `bg-danger`
            } h-2/3 rounded-lg`}
          />
          <motion.div
            className={`grid grid-cols-[20px_1fr] px-4 py-4 items-center gap-x-2`}
          >
            <motion.div className={`flex justify-end`}>
              <motion.div
                className={`${color} rounded-full w-2 h-2 ${animation}`}
              />
            </motion.div>
            <motion.p className="flex justify-start font-semibold italic text-xs uppercase">
              {text}
            </motion.p>
          </motion.div>
          <motion.div className="flex items-center justify-center font-medium py-4 px-4 text-center">
            {TextUtil.truncateString(task?.title, 50)}
          </motion.div>
          <motion.div className="flex items-center justify-center font-medium py-4 px-4 space-x-2">
            <motion.div className="flex justify-start">
              {TextUtil.refactorDate(task?.startDate)}
            </motion.div>
            <motion.div className="flex justify-start">-</motion.div>
            <motion.div className="flex justify-start">
              {TextUtil.refactorDate(task?.endDate)}
            </motion.div>
          </motion.div>
          <motion.div className="flex items-center justify-center relative px-4">
            <Popover
              items={popoverItems}
              height={28}
              width={36}
              position="bottom"
              triggerIcon={
                <BsThreeDots className="size-6 fill-gray-700 hover:fill-primary transition delay-50" />
              }
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

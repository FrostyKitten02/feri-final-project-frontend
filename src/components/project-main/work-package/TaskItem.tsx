import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { PopoverItem, TaskItemProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import TaskModal from "./TaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { BsThreeDots } from "react-icons/bs";
import Popover from "../../template/popover-menu/Popover";
import { TiFlag } from "react-icons/ti";

export const TaskItem: FC<TaskItemProps> = ({
  task,
  showIrrelevant,
  onSuccess,
  workpackage,
}) => {
  if (!task) return null;

  const progress = TextUtil.returnProgress(task.startDate, task.endDate);
  const daysLeft = TextUtil.returnDaysLeft(task.endDate);
  const { text, bgColor, animation } = TextUtil.returnProgressText(progress);

  const popoverItems: PopoverItem[] = [
    {
      component: (
        <TaskModal
          onSuccess={onSuccess}
          workpackage={workpackage}
          task={task}
        />
      ),
      label: "Edit",
    },
    {
      component: <DeleteTaskModal task={task} onSuccess={onSuccess} />,
      label: "Delete",
    },
  ];

  return (
    <AnimatePresence>
      {(showIrrelevant || task?.isRelevant) && (
        <motion.div
          className={`grid grid-cols-[5px_1fr_1fr_0.5fr] items-center overflow-visible border border-gray-200 border-solid mb-[-1px] bg-white rounded-md`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`${
              task?.isRelevant ? `bg-custom-green` : `bg-danger`
            } h-2/3 rounded-lg`}
          />
          <div className="flex flex-col justify-start py-4 pl-12 text-start gap-y-2">
            <p className="font-medium">
              {TextUtil.truncateString(task?.title, 80)}
            </p>
            <div
              className={`grid grid-cols-[10px_1fr] items-center gap-x-2`}
            >
              <div className={`flex`}>
                <div className={`${bgColor} rounded-full w-2 h-2 ${animation}`} />
              </div>
              <p className="flex justify-start font-semibold italic text-xs uppercase">
                {text}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-start py-4 px-4 space-x-2">
            <TiFlag className="size-5 fill-muted" />
            <p className="font-normal text-muted text-normal">
              {TextUtil.refactorDate(task.endDate)} ({daysLeft} days left)
            </p>
          </div>
          <div className="flex flex-row justify-center relative">
            <Popover
              items={popoverItems}
              height={28}
              width={40}
              position="top"
              triggerIcon={
                <BsThreeDots className="size-6 fill-gray-700 hover:fill-primary transition delay-50" />
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

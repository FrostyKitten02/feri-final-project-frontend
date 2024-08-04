import {AnimatePresence, motion} from "framer-motion";
import {FC} from "react";
import {TaskItemProps} from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import TaskModal from "./TaskModal";
import {DeleteTaskModal} from "./DeleteTaskModal";

export const TaskItem: FC<TaskItemProps> = ({task, showIrrelevant, onSuccess, workpackage,}) => {
    return (
        <AnimatePresence>
            {(showIrrelevant || task?.isRelevant) && (
                <motion.div
                    className={`grid grid-cols-[5px_1fr_1fr_1fr] items-center border-b border-gray-200 border-solid mb-[-1px]`}
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    exit={{opacity: 0, height: 0}}
                    transition={{duration: 0.2}}
                >
                    <motion.div
                        className={`${
                            task?.isRelevant ? `bg-custom-green` : `bg-red-600`
                        } h-full`}
                    />
                    <motion.div className="flex items-center justify-center font-medium py-4 px-4">
                        {task?.title}
                    </motion.div>
                    <motion.div className="flex items-center justify-start font-medium py-4 px-4">
                        {TextUtil.refactorDate(task?.startDate)} -{" "}
                        {TextUtil.refactorDate(task?.endDate)}
                    </motion.div>
                    <motion.div className="flex items-center justify-center gap-x-4 py-4 px-4">
                        <TaskModal
                            onSuccess={onSuccess}
                            workpackage={workpackage}
                            task={task}

                        />
                        {
                            task &&
                            <DeleteTaskModal
                                task={task}
                                onSuccess={onSuccess}
                            />
                        }
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

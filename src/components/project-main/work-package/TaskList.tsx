import { FC, useContext, useEffect, useState } from "react";
import { TaskItemProps, TaskListingProps } from "../../../interfaces";
import { useParams } from "react-router-dom";
import AssignPersonModalForm from "./AssignPersonModalForm";
import { TaskContext } from "../../../contexts";
import TextUtil from "../../../util/TextUtil";
import TickIcon from "../../../assets/icons/tick-circle-svgrepo-com.svg?react";
import XmarkIcon from "../../../assets/icons/xmark-circle-svgrepo-com.svg?react";

export const TaskListing: FC<TaskListingProps> = ({ workPackageId }) => {
  const { projectId } = useParams();

  const [assignPersonModalOpen, setAssignPersonModalOpen] =
    useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");

  // CONTEXT
  const taskContext = useContext(TaskContext);
  if (!taskContext) {
    throw new Error("TaskContext is not provided.");
  }
  const { tasks, fetchTasks } = taskContext;

  const tasksForWorkPackage = tasks?.filter(
    (task) => task.workPackageId === workPackageId
  ); // filter from all tasks for workpackage

  useEffect(() => {
    //setIsLoading(true);
    fetchTasks(); //.then(() => setIsLoading(false));
  }, [projectId]);

  const openAsignPersonModal = (id?: string, title?: string): void => {
    if (id && title) {
      setTaskId(id);
      setTaskTitle(title);
    }
    setAssignPersonModalOpen(true);
    console.log(taskId);
  };

  const closeAssignPersonModal = (): void => {
    setTaskId("");
    setTaskTitle("");
    setAssignPersonModalOpen(false);
  };

  return (
    <div className="h-full">
      <div>
        {assignPersonModalOpen && (
          <AssignPersonModalForm
            handleClose={closeAssignPersonModal}
            taskId={taskId}
            taskTitle={taskTitle}
          />
        )}
      </div>
      <div className="h-full">
        <div className="grid grid-cols-6 gap-12 pb-6">
          <div className="text-muted font-medium">Title</div>
          <div className="text-muted font-medium col-span-2">Estimation</div>
          <div className="text-muted font-medium">Relevant</div>
          <div className="text-muted font-medium col-span-2">Manage</div>
        </div>
        {tasksForWorkPackage.length > 0 ? (
          <div className="overflow-auto grid gap-y-6">
            {tasksForWorkPackage.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onAssignClick={openAsignPersonModal}
              />
            ))}
          </div>
        ) : (
          <div>No tasks found</div>
        )}
      </div>
    </div>
  );
};

const TaskItem: FC<TaskItemProps> = ({ task, onAssignClick }) => {
  return (
    task && (
      <div className="grid grid-cols-6 gap-12">
        <div className="font-medium">{task.title}</div>
        <div className="font-medium col-span-2">
          {TextUtil.refactorDate(task.startDate)} -{" "}
          {TextUtil.refactorDate(task.endDate)}
        </div>
        <div className="flex justify-start">
          {task.isRelevant ? (
            <TickIcon className="size-6 fill-green" />
          ) : (
            <XmarkIcon className="size-6 fill-red-700" />
          )}
        </div>
        <div className="col-span-2">
          {task.isRelevant && (
            <button onClick={() => onAssignClick(task.id, task.title)}>
              <span>Assign person</span>
            </button>
          )}
        </div>
      </div>
    )
  );
};

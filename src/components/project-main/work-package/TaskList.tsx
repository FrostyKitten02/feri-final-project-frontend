import { FC, useContext, useEffect, useState } from "react";
import { TaskItemProps, TaskListingProps } from "../../../interfaces";
import { useParams } from "react-router-dom";
import AssignPersonModalForm from "./AssignPersonModalForm";
import { TaskContext } from "../../../contexts";

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
    <div>
      <div>
        {assignPersonModalOpen && (
          <AssignPersonModalForm
            handleClose={closeAssignPersonModal}
            taskId={taskId}
            taskTitle={taskTitle}
          />
        )}
      </div>
      <div>
        {tasksForWorkPackage.length > 0 ? (
          <div>
            {tasksForWorkPackage.map((task) => (
              <div key={task.id}>
                <TaskItem task={task} onAssignClick={openAsignPersonModal} />
              </div>
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
      <div key={task.id} className="flex flex-row gap-x-6">
        <div>{task.title}</div>
        <div>
          <button onClick={() => onAssignClick(task.id, task.title)}>
            <span>Assign person</span>
          </button>
        </div>
      </div>
    )
  );
};

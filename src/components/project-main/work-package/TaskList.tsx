import { FC } from "react";
import { TaskItemProps, TaskListingProps } from "../../../interfaces";

export const TaskListing: FC<TaskListingProps> = ({ allTasks, onAssignClick }) => {
  return (
    <div>
      {allTasks.length > 0 ? (
        <div>
          {allTasks.map((task) => (
            <div key={task.id}>
              <TaskItem task={task} onAssignClick={onAssignClick}/>
            </div>
          ))}
        </div>
      ) : (
        <div>No tasks found</div>
      )}
    </div>
  );
};

const TaskItem: FC<TaskItemProps> = ({ task, onAssignClick }) => {
  return (
    task && (
      <div key={task.id} className="flex flex-row gap-x-6">
        <div>{task.title}</div>
        <div>
          <button onClick={() => onAssignClick(task.id)}>
            <span>Assign person</span>
          </button>
        </div>
      </div>
    )
  );
};

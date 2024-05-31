import { FC } from "react";
import { TaskItemProps, TaskListingProps } from "../../../interfaces";

export const TaskListing: FC<TaskListingProps> = ({ allTasks }) => {
  return (
    <div>
      {allTasks.length > 0 ? (
        <div>
          {allTasks.map((task) => (
            <div key={task.id}>
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      ) : (
        <div>No tasks found</div>
      )}
    </div>
  );
};

const TaskItem: FC<TaskItemProps> = ({ task /*onClick*/ }) => {
  return (
    task && (
      <div key={task.id} className="flex flex-row gap-x-6">
        <div>{task.title}</div>
        <div>
          <button>
            <span>Assign person</span>
          </button>
        </div>
      </div>
    )
  );
};

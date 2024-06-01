import React from "react";
import { TaskDto } from "../temp_ts";

interface TaskContextProps {
  tasks: TaskDto[];
  fetchTasks: () => Promise<void>;
}
export const TaskContext = React.createContext<TaskContextProps | undefined>(
  undefined
);

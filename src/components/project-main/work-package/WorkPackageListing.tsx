import { FC, useEffect, useState } from "react";
import {
  WorkPackageListingProps,
} from "../../../interfaces";
import { TaskDto, WorkPackageDto } from "../../../../temp_ts";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../util/ApiDeclarations";
import { toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import TaskModalForm from "./TaskModalForm";
import { TaskContext } from "../../../contexts";
import WorkPackageForm from "./WorkpackageForm";
import { WorkPackageItem } from "./WorkPackageItem";

export const WorkPackageListing: FC<WorkPackageListingProps> = ({
  isFormOpen,
  setIsFormOpen,
}) => {
  const { projectId } = useParams();

  const [workPackages, setWorkPackages] = useState<WorkPackageDto[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const [workPackageId, setWorkPackageId] = useState<string>("");
  const [workPackageTitle, setWorkPackageTitle] = useState<string>("");

  const requestArgs = useRequestArgs();

  useEffect(() => {
    setIsLoading(true);
    fetchWorkPackagesAndTasksForProject().then(() => {
      setIsLoading(false);
    });
  }, [projectId]);

  const openTaskModal = (id?: string, name?: string): void => {
    if (id && name) {
      setWorkPackageId(id);
      setWorkPackageTitle(name);
    }
    setTaskModalOpen(true);
  };

  const closeTaskModal = (): void => {
    setWorkPackageId("");
    setWorkPackageTitle("");
    setTaskModalOpen(false);
  };

  const handleAddTask = (): void => {
    fetchWorkPackagesAndTasksForProject();
    setWorkPackageId("");
    setWorkPackageTitle("");
    setTaskModalOpen(false);
  };

  const closeWorkPackageModal = (): void => {
    setIsFormOpen(false);
  };

  const handleAddWorkPackage = (): void => {
    fetchWorkPackagesAndTasksForProject();
    setIsFormOpen(false);
  };

  const fetchWorkPackagesAndTasksForProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200) {
          if (response.data.projectDto?.workPackages) {
            setWorkPackages(response.data.projectDto.workPackages);
            const allTasks = response.data.projectDto.workPackages.flatMap(
              (wp) => wp.tasks || []
            );
            setTasks(allTasks);
          }
        }
      } else {
        toastError("Project id not found!");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  /*
  const fetchTasks = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200) {
          if (response.data.projectDto?.workPackages) {
            const allTasks = response.data.projectDto.workPackages.flatMap(
              (wp) => wp.tasks || []
            );
            setTasks(allTasks);
          }
        }
      } else {
        toastError("Project id not found!");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };
  */

  return (
    <TaskContext.Provider value={{ tasks, fetchWorkPackagesAndTasksForProject }}>
      <div>
        {isFormOpen && (
          <WorkPackageForm
            setIsFormOpen={setIsFormOpen}
            handleAddWorkPackage={handleAddWorkPackage}
            handleClose={closeWorkPackageModal}
          />
        )}
      </div>
      <div>
        {taskModalOpen && (
          <TaskModalForm
            handleClose={closeTaskModal}
            handleAddTask={handleAddTask}
            workPackageId={workPackageId}
            workPackageTitle={workPackageTitle}
          />
        )}
      </div>
      <div className="flex-grow">
        <div className="flex flex-col h-full">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center font-bold text-3xl">
              <h1>Loading work packages...</h1>
            </div>
          ) : workPackages && workPackages.length > 0 ? (
            <div className="flex-col flex-grow gap-y-10 ">
              {workPackages.map((workPackage) => (
                <div key={workPackage.id}>
                  <WorkPackageItem
                    workPackage={workPackage}
                    onClick={openTaskModal}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full justify-center items-center font-bold text-3xl space-y-4">
              <h1>No work packages found...</h1>
              <p className="text-base text-gray-700">
                Click the "Add work package" button to add a new work package.
              </p>
            </div>
          )}
        </div>
      </div>
    </TaskContext.Provider>
  );
};

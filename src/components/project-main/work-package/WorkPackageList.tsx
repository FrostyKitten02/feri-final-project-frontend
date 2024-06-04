import { FC, useEffect, useState } from "react";
import {
  WorkPackageItemProps,
  WorkPackageListingProps,
} from "../../../interfaces";
import { TaskListing } from "./TaskList";
import { TaskDto, WorkPackageDto } from "../../../../temp_ts";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../util/ApiDeclarations";
import { toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import TaskModalForm from "./TaskModalForm";
import { TaskContext } from "../../../contexts";
import WorkPackageForm from "./WorkpackageForm";

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
  const [workPackageTitle, setWorkPackageTitle] = useState<string>("")

  const requestArgs = useRequestArgs();

  useEffect(() => {
    setIsLoading(true);
    fetchWorkPackagesForProject().then(() => {
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
    fetchTasks();
    setWorkPackageId("");
    setWorkPackageTitle("");
    setTaskModalOpen(false);
  };

  const closeWorkPackageModal = (): void => {
    setIsFormOpen(false);
  };

  const handleAddWorkPackage = (): void => {
    fetchWorkPackagesForProject();
    setIsFormOpen(false);
  };

  const fetchWorkPackagesForProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200) {
          if (response.data.projectDto?.workPackages) {
            setWorkPackages(response.data.projectDto.workPackages);
          }
        }
      } else {
        toastError("Project id not found!");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

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

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks }}>
      <div>
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
      </div>
    </TaskContext.Provider>
  );
};

const WorkPackageItem: FC<WorkPackageItemProps> = ({
  workPackage,
  onClick,
}) => {
  return (
    workPackage && (
      <div key={workPackage.id} className="p-5 h-72">
        <div className="flex hover:bg-gray-100 items-center rounded-xl p-10 h-full border border-gray-200 border-solid shadow-xl">
          <div className="w-full h-full">
            <div className="border-l-4 border-solid border-rose-500 w-full">
              <div
                className={`flex ${
                  workPackage.isRelevant ? "bg-green-500" : "bg-red-700"
                } w-fit px-2 rounded-lg ml-2 justify-start items-center`}
              >
                <div className="font-semibold italic text-white text-sm">
                  Relevant: {workPackage.isRelevant ? <p>YES</p> : <p>NO</p>}
                </div>
              </div>
              <h1 className="font-bold pl-4 text-xl">{workPackage.title}</h1>
            </div>
            <div className="flex flex-row pt-4 pb-4 gap-x-12 w-full">
              <div>
                <p className="font-semibold text-gray-700">Start:</p>
                <p className="font-semibold">{workPackage.startDate}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">End:</p>
                <p className="font-semibold">{workPackage.endDate}</p>
              </div>
            </div>
            <button
              onClick={() => onClick(workPackage.id, workPackage.title)}
              className="flex items-center justify-center bg-rose-500 text-white w-24"
            >
              Add task
            </button>
          </div>
          <div className="w-1/2 h-full">
            <TaskListing workPackageId={workPackage.id} />
          </div>
        </div>
      </div>
    )
  );
};

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import WorkPackageForm from "./WorkpackageForm";
import {
  CreateWorkPackageRequest,
  TaskDto,
  WorkPackageDto,
} from "../../../../temp_ts";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import { workPackageAPI, projectAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { WorkPackageFormFields } from "../../../types/forms/formTypes";
import TaskModalForm from "./TaskModalForm";
import { WorkPackageListing } from "./WorkPackageList";

export default function WorkPackagePage() {
  const { projectId } = useParams();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // work package form
  const [workPackages, setWorkPackages] = useState<WorkPackageDto[]>();
  const [tasks, setTasks] = useState<TaskDto[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // task form modal
  const [workPackageId, setWorkPackageId] = useState<string>("");

  const requestArgs = useRequestArgs();

  const open = (id?: string): void => {
    if (id) setWorkPackageId(id);
    setModalOpen(true);
  };

  const close = (): void => {
    setWorkPackageId("");
    setModalOpen(false);
  };

  const handleAddTask = (): void => {
    setWorkPackageId("");
    setModalOpen(false);

    fetchWorkPackagesForProject();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchWorkPackagesForProject().then(() => setIsLoading(false));
  }, [projectId]);

  const fetchWorkPackagesForProject = async (): Promise<void> => {
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

  const onSubmit: SubmitHandler<WorkPackageFormFields> = async (
    data
  ): Promise<void> => {
    // onSUbmit function passed to the form (react hook form)
    const workPackage: CreateWorkPackageRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      isRelevant: data.isRelevant,
      projectId: projectId,
    };

    try {
      if (projectId) {
        const response = await workPackageAPI.createWorkPackage(
          workPackage,
          requestArgs
        );
        if (response.status === 201) {
          fetchWorkPackagesForProject();
          toastSuccess(
            "Work package " +
              data.title +
              " was successfully added to the project!"
          );
        }
      } else {
        toastError("Project id not found");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full px-12 py-6 w-full">
        <div className="flex flex-row py-6">
          <div className="flex justify-start w-2/3 items-center">
            <h1 className="font-bold text-3xl">Work packages</h1>
          </div>
          <div className="flex w-1/3 justify-end items-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex justify-center items-center bg-rose-500 text-white rounded-lg h-12 space-x-4 w-52"
            >
              <span className="font-semibold text-2xl">+</span>
              <span className="font-semibold text-lg">Add work package</span>
            </button>
          </div>
        </div>
        <WorkPackageForm
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onSubmit={onSubmit}
        />
        {modalOpen && (
          <TaskModalForm
            handleClose={close}
            handleAddTask={handleAddTask}
            workPackageId={workPackageId}
          />
        )}
        <div
          className={`flex flex-col py-12 px-12 mt-6 border-2 border-solid rounded-2xl border-gray-200 w-full h-full ${
            isFormOpen ? "" : "z-10"
          } overflow-auto`}
        >
          <WorkPackageListing
            isLoading={isLoading}
            allWorkPackages={workPackages || []}
            allWorkPackageTasks={tasks || []}
            onClick={open}
          />
        </div>
      </div>
    </div>
  );
}

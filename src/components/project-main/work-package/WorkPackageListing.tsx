import { FC, useEffect, useState } from "react";
import { ProjectDto, WorkPackageDto } from "../../../../temp_ts";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../util/ApiDeclarations";
import { toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import { WorkPackageItem } from "./WorkPackageItem";
import WorkPackageModal from "./WorkPackageModal";
import { Spinner } from "flowbite-react";

export const WorkPackageListing: FC = () => {
  const { projectId } = useParams();
  const [workPackages, setWorkPackages] = useState<WorkPackageDto[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const requestArgs = useRequestArgs();

  useEffect(() => {
    setLoading(true);
    fetchWorkPackagesForProject();
  }, [projectId]);

  const onSuccess = (): void => {
    fetchWorkPackagesForProject();
  };
  const fetchWorkPackagesForProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(projectId, requestArgs);
        if (response.status === 200) {
          if (response.data.projectDto) {
            setProjectDetails(response.data.projectDto);
          }
          if (response.data.projectDto?.workPackages) {
            const sortedWorkPackagesByDate =
              response.data.projectDto?.workPackages?.sort((a, b) => {
                const fallbackDate = new Date(Date.now()).getTime();
                const dateA = a.startDate
                  ? new Date(a.startDate).getTime()
                  : fallbackDate;
                const dateB = b.startDate
                  ? new Date(b.startDate).getTime()
                  : fallbackDate;
                return dateA - dateB;
              });
            setWorkPackages(sortedWorkPackagesByDate);
          } else setWorkPackages([]);
        }
      } else {
        toastError("Project id not found!");
      }
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-row h-full flex-grow">
        <div
          className={`flex flex-col py-12 px-12 border-r-2 border-solid border-gray-200 w-full h-full overflow-y-scroll`}
        >
          <div className="flex-grow">
            <div className="flex flex-col h-full">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="xl" />
                </div>
              ) : workPackages.length > 0 ? (
                <div className="flex-col flex-grow gap-y-10">
                  {workPackages.map((workPackage) => (
                    <div key={workPackage.id}>
                      <WorkPackageItem
                        projectDetails={projectDetails}
                        onSuccess={onSuccess}
                        workPackage={workPackage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col h-full items-center justify-center">
                  <p className="text-2xl font-bold">No work packages found.</p>
                  <p>Navigate to the top right to create a work package.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex px-6 items-start pt-6">
          <WorkPackageModal
            onSuccess={onSuccess}
            projectDetails={projectDetails}
          />
        </div>
      </div>
    </div>
  );
};

import { FC, useEffect, useState } from "react";
import { ProjectDto, WorkPackageDto } from "../../../../temp_ts";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../util/ApiDeclarations";
import { toastError } from "../../toast-modals/ToastFunctions";
import { useRequestArgs } from "../../../util/CustomHooks";
import { WorkPackageItem } from "./WorkPackageItem";
import WorkPackageModal from "./WorkPackageModal";
import { Spinner } from "flowbite-react";
import RequestUtil from "../../../util/RequestUtil";
import { LuPackageOpen } from "react-icons/lu";

export const WorkPackageListing: FC = () => {
  const { projectId } = useParams();
  const [workPackages, setWorkPackages] = useState<WorkPackageDto[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const requestArgs = useRequestArgs();

  useEffect(() => {
    console.log("useEffect called with projectId:", projectId);
    setLoading(true);
    fetchWorkPackagesForProject();
  }, [projectId]);

  const onSuccess = (): void => {
    fetchWorkPackagesForProject();
  };
  const fetchWorkPackagesForProject = async (): Promise<void> => {
    try {
      if (projectId) {
        const response = await projectAPI.getProject(
          projectId,
          await requestArgs.getRequestArgs()
        );
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
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full p-10">
      <div
        className={`relative flex flex-col  flex-grow border-[1px] border-gray-200 border-solid rounded-[20px]`}
      >
        <div className="w-full h-full px-16 rounded-bl-[20px] overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-muted scrollbar-track-white">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="xl" />
            </div>
          ) : workPackages.length > 0 ? (
            workPackages.map((workPackage) => (
              <WorkPackageItem
                key={workPackage.id}
                projectDetails={projectDetails}
                onSuccess={onSuccess}
                workPackage={workPackage}
              />
            ))
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <LuPackageOpen className="stroke-gray-300 size-44 pb-6"/>
              <p className="text-2xl font-bold">No work packages found.</p>
              <p>Navigate to the top right to create a work package.</p>
            </div>
          )}
        </div>
        <div className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
          WORK PACKAGES
        </div>
        <div className="absolute right-[-25px] top-[-30px]">
          <div className="bg-white py-2 px-2">
            <WorkPackageModal
              onSuccess={onSuccess}
              projectDetails={projectDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

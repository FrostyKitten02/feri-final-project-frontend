import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProjectBudgetSchemaDto, ProjectDto, ProjectStatisticsResponse,} from "../../../../client";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectDetails} from "./ProjectDetails";
import {WorkDetails} from "./WorkDetails";
import {CurrentlyRelevant} from "./CurrentlyRelevant";
import {CostTimeline} from "./CostTimeline";
import {BudgetBreakdown} from "./BudgetBreakdown";
import {Spinner} from "flowbite-react";
import RequestUtil from "../../../util/RequestUtil";

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDto>();
  const [chosenSchema, setChosenSchema] = useState<ProjectBudgetSchemaDto>();
  const [statistics, setStatistics] = useState<ProjectStatisticsResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const requestArgs = useRequestArgs();

  useEffect(() => {
    fetchData();
  }, [projectId]);
  const getProjectSchema = (schemas: ProjectBudgetSchemaDto[], id: string) => {
    return schemas.find((schema) => schema.id === id);
  };

  const fetchData = async () => {
    if (!projectId) return;
    try {
      const projectPromise = projectAPI.getProject(projectId, await requestArgs.getRequestArgs());
      const schemaPromise =
        projectSchemaAPI.getAllProjectBudgetSchema(await requestArgs.getRequestArgs());
      const statisticsPromise = projectAPI.getProjectStatistics(
        projectId,
        undefined,
        undefined,
          await requestArgs.getRequestArgs()
      );
      const [projectResponse, schemaResponse, statisticsResponse] =
        await Promise.all([projectPromise, schemaPromise, statisticsPromise]);
      if (projectResponse.status === 200) {
        const projectData = projectResponse.data.projectDto;
        setProject(projectData);
      }
      if (schemaResponse.status === 200 && projectResponse.status === 200) {
        const schemasData = schemaResponse.data.projectBudgetSchemaDtoList;
        if (
          schemasData &&
          projectResponse.data.projectDto &&
          projectResponse.data.projectDto.projectBudgetSchemaId
        ) {
          const projectSchema = getProjectSchema(
            schemasData,
            projectResponse.data.projectDto.projectBudgetSchemaId
          );
          setChosenSchema(projectSchema);
        }
      }
      if (statisticsResponse.status === 200) {
        const statisticsData = statisticsResponse.data;
        setStatistics(statisticsData);
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-grow overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex">
              {project && chosenSchema && (
                <ProjectDetails project={project} chosenSchema={chosenSchema} handleEditProject={fetchData} />
              )}
              {project && statistics && (
                <WorkDetails project={project} statistics={statistics} />
              )}
            </div>
            <div className="flex flex-grow">
              {statistics && <CostTimeline stats={statistics} />}
              {<BudgetBreakdown statistics={statistics}/>}
            </div>
          </div>
          <div className="py-5 pr-5 w-[400px]">
            <div className="relative py-5 pr-5 z-0 h-full">
              <div className="border-gray-200 h-full flex justify-center items-center rounded-[20px] p-5 border-solid border-[1px]">
                {statistics && <CurrentlyRelevant statistics={statistics} />}
              </div>
              <div
                  className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-14 uppercase flex px-2">
                currently relevant
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}

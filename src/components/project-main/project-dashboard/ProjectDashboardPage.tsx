import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ProjectBudgetSchemaDto,
  ProjectDto,
  ProjectStatisticsResponse,
} from "../../../../temp_ts";
import { projectAPI, projectSchemaAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { ProjectDetails } from "./ProjectDetails";
import { WorkDetails } from "./WorkDetails";
import { CurrentMonth } from "./CurrentMonth";
import { CostTimeline } from "./CostTimeline";
import { BudgetBreakdown } from "./BudgetBreakdown";
import { Spinner } from "flowbite-react";

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDto>();
  const [chosenSchema, setChosenSchema] = useState<ProjectBudgetSchemaDto>();
  const [statistics, setStatistics] = useState<ProjectStatisticsResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const requestArgs = useRequestArgs();

  const getProjectSchema = (schemas: ProjectBudgetSchemaDto[], id: string) => {
    return schemas.find((schema) => schema.id === id);
  };

  const fetchData = async () => {
    if (!projectId) return;
    try {
      const projectPromise = projectAPI.getProject(projectId, requestArgs);
      const schemaPromise =
        projectSchemaAPI.getAllProjectBudgetSchema(requestArgs);
      const statisticsPromise = projectAPI.getProjectStatistics(
        projectId,
        requestArgs
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  return (
    <div className="flex flex-grow">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex">
              {project && chosenSchema && (
                <ProjectDetails project={project} chosenSchema={chosenSchema} />
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
          <div className="w-[350px] bg-gray-100 flex flex-col rounded-[20px] p-5">
            {statistics && <CurrentMonth statistics={statistics} handleEditProject={fetchData}/>}
          </div>
        </>
      )}
    </div>
  );
}

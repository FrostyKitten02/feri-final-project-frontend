import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProjectBudgetSchemaDto, ProjectDto, ProjectStatisticsResponse} from "../../../../temp_ts";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectDetails} from "./ProjectDetails";
import {WorkDetails} from "./WorkDetails";

export default function ProjectDashboardPage() {
    const {projectId} = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectDto>();
    const [chosenSchema, setChosenSchema] = useState<ProjectBudgetSchemaDto>();
    const [statistics, setStatistics] = useState<ProjectStatisticsResponse>();
    const requestArgs = useRequestArgs();

    const getProjectSchema = (schemas: ProjectBudgetSchemaDto[], id: string) => {
        return schemas.find(schema => schema.id === id);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!projectId) return;
            try {
                const projectPromise = projectAPI.getProject(projectId, requestArgs);
                const schemaPromise = projectSchemaAPI.getAllProjectBudgetSchema(requestArgs);
                const statisticsPromise =projectAPI.getProjectStatistics(projectId, requestArgs);
                const [projectResponse, schemaResponse, statisticsResponse] = await Promise.all([projectPromise, schemaPromise, statisticsPromise]);
                if (projectResponse.status === 200) {
                    const projectData = projectResponse.data.projectDto;
                    setProject(projectData);
                }
                if (schemaResponse.status === 200 && projectResponse.status === 200) {
                    const schemasData = schemaResponse.data.projectBudgetSchemaDtoList;
                    if (schemasData && projectResponse.data.projectDto && projectResponse.data.projectDto.projectBudgetSchemaId) {
                        const projectSchema = getProjectSchema(schemasData, projectResponse.data.projectDto.projectBudgetSchemaId);
                        setChosenSchema(projectSchema);
                    }
                }
                if(statisticsResponse.status === 200){
                    const statisticsData = statisticsResponse.data;
                    setStatistics(statisticsData);
                }
            } catch (error) {
            }
        };
        fetchData();
    }, [projectId]);

    return (
        <div className="flex flex-grow">
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex">
                    {
                        project && chosenSchema &&
                        <ProjectDetails project={project} chosenSchema={chosenSchema}/>
                    }
                    {
                        project && statistics &&
                        <WorkDetails project={project} statistics={statistics} />
                    }
                </div>
                <div className="flex flex-grow">
                    <div className="relative p-5">
                        <div className="border-gray-200 w-[700px] h-full rounded-[20px] p-5 border-solid border-[1px]">
                            <div>
                                budget spent; kolko je ze porabljeno od tega kolko je na voljo
                                staff budget po mesecih kolko je blo porabljeno / kolko se je
                                zaracunalo povprečno da bi se naj porablo
                            </div>
                        </div>
                        <div className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                            budget breakdown
                        </div>
                    </div>
                    <div className="relative p-5 flex-grow">
                        <div className="p-5 border-solid border-[1px] rounded-[20px] border-gray-200 h-full">
                            section
                        </div>
                        <div className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                            N/A
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[350px] bg-gray-100 rounded-[20px] p-5">
                TRENUTNO POMEMBNO (TA MESEC)
                side analytics here
                <div>
                    kolko se je delalo ta mesec - kolko je kdo delal ta mesec
                </div>
                <div>
                    na cem se je delalo ta mesec; kolko PM so naredli, kolko se je moglo
                </div>
            </div>
        </div>
    )
}
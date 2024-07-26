import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProjectBudgetSchemaDto, ProjectDto} from "../../../../temp_ts";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectDetails} from "./ProjectDetails";

export default function ProjectDashboardPage() {
    const {projectId} = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectDto>();
    const [chosenSchema, setChosenSchema] = useState<ProjectBudgetSchemaDto>();
    const requestArgs = useRequestArgs();

    const getProjectSchema = (schemas: ProjectBudgetSchemaDto[]) => {
        if (!project) {
            return undefined;
        }
        return schemas.find(schema => schema.id === project.projectBudgetSchemaId);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!projectId) return;
            try {
                const projectPromise = projectAPI.getProject(projectId, requestArgs);
                const schemaPromise = projectSchemaAPI.getAllProjectBudgetSchema(requestArgs);
                const [projectResponse, schemaResponse] = await Promise.all([projectPromise, schemaPromise]);
                if (projectResponse.status === 200) {
                    const projectData = projectResponse.data.projectDto;
                    setProject(projectData);
                }
                if (schemaResponse.status === 200) {
                    const schemasData = schemaResponse.data.projectBudgetSchemaDtoList;
                    if (schemasData !== undefined) {
                        const projectSchema = getProjectSchema(schemasData);
                        setChosenSchema(projectSchema);
                    }
                }
            } catch (error) {
            }
        };
        fetchData();
    }, [projectId, requestArgs]);

    return (
        <div className="flex flex-grow">
            <div className="p-5 flex-grow">
                <div className="flex">
                    {
                        project && chosenSchema &&
                        <ProjectDetails project={project} chosenSchema={chosenSchema} />
                    }
                </div>
                <div>
                    budget spent; kolko je ze porabljeno od tega kolko je na voljo
                    staff budget po mesecih kolko je blo porabljeno / kolko se je
                    zaracunalo povprečno da bi se naj porablo
                </div>
                <div>

                </div>
            </div>
            <div className="w-[300px] bg-gray-100 rounded-[20px] p-5">
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
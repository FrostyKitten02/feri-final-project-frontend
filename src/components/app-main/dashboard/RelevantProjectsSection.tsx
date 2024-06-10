import {useEffect, useState} from "react";
import {ListProjectResponse} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import TextUtil from "../../../util/TextUtil";
import {useNavigate} from "react-router-dom";
import SessionUtil from "../../../util/SessionUtil";

export const RelevantProjectsSection = () => {
    //todo add loading state
    const [projectResponse, setProjectResponse] = useState<ListProjectResponse>();
    const navigate = useNavigate();
    const requestArgs = useRequestArgs();
    const navigateToProject = (id: string | undefined) => {
        if (id !== undefined) {
            navigate(`/${id}`);
            SessionUtil.setSidebarSelect('');
        }
    }
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await projectAPI.listProjects(
                    {
                        elementsPerPage: 50,
                        pageNumber: 1,
                    },
                    {
                        ascending: true,
                        fields: ["CREATED_AT"],
                    },
                    undefined,
                    requestArgs
                );
                if (res.status === 200)
                    setProjectResponse(res.data);
            } catch (error) {

            }
        };
        fetchProjects();

    }, [])
    return (
        <div className="flex-grow">
            {//todo add filter so only relevant projects are shown
                projectResponse?.projects ?
                    TextUtil.getRelevantProjects(projectResponse.projects).map(project => {
                        return (
                            <div key={project.id} className="">
                                <button onClick={() => navigateToProject(project.id)}>
                                    {project.title}
                                </button>
                            </div>)
                    }) :
                    <div>
                        You aren't working on any projects currently.
                    </div>
            }
        </div>
    )
}
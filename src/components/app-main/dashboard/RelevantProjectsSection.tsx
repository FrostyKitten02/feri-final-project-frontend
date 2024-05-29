import {useEffect, useState} from "react";
import {ListProjectResponse} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";

export const RelevantProjectsSection = () => {
    //todo add loading state
    const [projectResponse, setProjectResponse] = useState<ListProjectResponse>();
    const requestArgs = useRequestArgs();
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
                else
                    console.log(res);
            } catch (error) {
                console.error("Error during request:", error);
            }
        };
        //todo podrobnosti errorja se naj ne bi izpisovale uporabniku
        fetchProjects().catch(error => console.log('Following error occurred', error));

    }, [])
    return (
        <div>
            {//todo add filter so only relevant projects are shown
                projectResponse ?
                projectResponse?.projects?.map(project => {
                    return (
                        <div key={project.id} className="">
                            {project.title}
                        </div>)
                }) :
                <div>
                    You aren't working on any projects currently.
                </div>
            }
        </div>
    )
}
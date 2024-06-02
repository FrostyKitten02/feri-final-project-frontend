import {ProjectDto} from "../../temp_ts";

export default class TextUtil {
    static replaceSpaces (value: string): string{
        return value.replace(/ /g, "-");
    }
    static getRelevantProjects (projects: ProjectDto []): ProjectDto[]{
        const today = new Date();
        const filteredProjects = projects.filter(project => {
            if(!project.endDate)
                return false;
            const endDate = new Date(project.endDate);
            return endDate > today;
        })
        return(filteredProjects);
    }
}

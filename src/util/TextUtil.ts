import {ProjectDto} from "../../temp_ts";
import {ProgressObject} from "../interfaces";

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

    static refactorDate (value: string | undefined): string {
        if(value) {
            const date = new Date(value);
            return date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
        return "";
    }

    static returnProgress (startDate: string | undefined, endDate:string | undefined): number {
        if(startDate && endDate){
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            const totalDuration = end - start;
            const elapsedTime = now - start;
            return Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100);
        }
        return 0;
    }

    static returnProgressText (value: number): ProgressObject {
        if(value === 100){
            return ({
                text: "finished",
                color: "bg-green"
            })
        }
        else if (value !== 100 && value !== 0){
            return ({
                text: "in progress",
                color: "bg-yellow"
            })
        }
        else return ({
                text: "scheduled",
                color: "bg-secondary"
            })
    }
    static isValidUUID(uuid: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}

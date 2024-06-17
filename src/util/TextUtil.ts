import {ProjectDto, ProjectMonthDto, WorkPackageDto} from "../../temp_ts";
import {ProgressObject} from "../interfaces";

export default class TextUtil {
    static replaceSpaces(value: string): string {
        return value.replace(/ /g, "-");
    }

    static getRelevantProjects(projects: ProjectDto []): ProjectDto[] {
        const today = new Date();
        const filteredProjects = projects.filter(project => {
            if (!project.endDate)
                return false;
            const endDate = new Date(project.endDate);
            return endDate > today;
        })
        return (filteredProjects);
    }

    static refactorDate(value: string | undefined): string {
        if (value) {
            const date = new Date(value);
            return date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
        return "";
    }

    static returnProgress(startDate: string | undefined, endDate: string | undefined): number {
        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            const totalDuration = end - start;
            const elapsedTime = now - start;
            return Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100);
        }
        return 0;
    }

    static returnProgressText(value: number): ProgressObject {
        if (value === 100) {
            return ({
                text: "finished",
                color: "bg-green"
            })
        } else if (value !== 100 && value !== 0) {
            return ({
                text: "in progress",
                color: "bg-yellow"
            })
        } else return ({
            text: "scheduled",
            color: "bg-secondary"
        })
    }

    static isValidUUID(uuid: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    static formatFormDate(date: Date): string {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return "";
    }

    static truncateString(str: string | undefined, num: number): string {
        if (!str)
            return "";
        if (str.length <= num) {
            return str;
        }
        const truncated = str.slice(0, num);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
            return truncated + '...';
        }
        return truncated.slice(0, lastSpaceIndex) + '...';
    }

    static getMonthAbbreviation(value: string | undefined): string {
        if (!value)
            return "Invalid Date";
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return "Invalid Date";
        const monthName = date.toLocaleString('default', {month: 'long'});
        return monthName.slice(0, 3);
    }

    static getMonthNumber(value: string | undefined, startMonth: ProjectMonthDto | undefined): number {
        if (!value || !startMonth || !startMonth.date || !startMonth.monthNumber)
            return 0;
        const diff = new Date(startMonth.date).getMonth() + 1 - startMonth.monthNumber;
        const wpDate = new Date(value);
        const wpYear = wpDate.getFullYear();
        const wpMonths = wpDate.getMonth() + 1;
        const startMonthYear = new Date(startMonth.date).getFullYear();
        const monthDiff = (wpYear - startMonthYear) * 12;
        return (monthDiff - diff + wpMonths);
    }
    static calculateSubgridNumber(workPackage: WorkPackageDto, date: string | undefined): number {
        if(!workPackage || !workPackage.startDate || !date)
            return 0;
        const wpDate = new Date(workPackage.startDate);
        const wpYear = wpDate.getFullYear();
        const wpMonth = wpDate.getMonth() + 1;
        const taskDate = new Date(date);
        const taskYear = taskDate.getFullYear();
        const taskMonth = taskDate.getMonth() + 1;

        const yearDiff = (taskYear - wpYear) * 12;
        const monthsDiff = taskMonth - wpMonth;

        return yearDiff + monthsDiff + 1;
    }
}

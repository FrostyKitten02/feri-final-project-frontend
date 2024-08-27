import {
    PersonOnProjectDto,
    ProjectStatisticsResponse,
    ProjectStatisticsUnitDto,
    TaskDto,
    WorkPackageDto,
} from "../../temp_ts";
import {
    BudgetBreakdownChartProps,
    ProgressObject,
    WorkpackageLimitProps,
    YearLimitProps,
} from "../interfaces";

export default class TextUtil {
    static replaceSpaces(value: string): string {
        return value.replace(/ /g, "-");
    }

    static refactorDate(value: string | undefined): string {
        if (value) {
            const date = new Date(value);
            return date.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
        return "";
    }

    static returnProgress(
        startDate: string | undefined,
        endDate: string | undefined
    ): number {
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

    static returnDuration(
        startDate: string | undefined,
        endDate: string | undefined
    ): number {
        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const duration = end - start;
            return duration / 86400000;
        }
        return 0;
    }

    static returnDaysLeft(endDate: string | undefined): string {
        if (endDate) {
            const now = new Date(Date.now()).getTime();
            const end = new Date(endDate).getTime();
            const daysLeft = (end - now) / 86400000;
            if (daysLeft > 0) {
                return daysLeft.toFixed(0);
            } else {
                return "0";
            }
        }
        return "0";
    }

    static returnProgressText(value: number): ProgressObject {
        if (value === 100) {
            return {
                text: "finished",
                color: "emerald",
                bgColor: "bg-custom-green",
            };
        } else if (value !== 100 && value !== 0) {
            return {
                text: "in progress",
                color: "amber",
                animation: "animate-pulse",
                bgColor: "bg-warning",
            };
        } else
            return {
                text: "scheduled",
                color: "red",
                bgColor: "bg-danger",
            };
    }

    static isValidUUID(uuid: string) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    static formatFormDate(date: Date): string {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
        return "";
    }

    static truncateString(str: string | undefined, num: number): string {
        if (!str) return "";
        if (str.length <= num) {
            return str;
        }
        const truncated = str.slice(0, num);
        const lastSpaceIndex = truncated.lastIndexOf(" ");
        if (lastSpaceIndex === -1) {
            return truncated + "...";
        }
        return truncated.slice(0, lastSpaceIndex) + "...";
    }

    static getMonthAbbreviation(value: string | undefined): string {
        if (!value) return "";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "";
        const monthName = date.toLocaleString("default", {month: "long"});
        return monthName.slice(0, 3);
    }

    static getMonthNumber(
        value: string | undefined,
        startUnit: ProjectStatisticsUnitDto | undefined,
        currentPage: number,
        monthsPerPage: number
    ): number {
        if (!value || !startUnit || !startUnit.startDate || !startUnit.unitNumber)
            return 0;
        const diff =
            new Date(startUnit.startDate).getMonth() + 1 - startUnit.unitNumber;
        const wpDate = new Date(value);
        const wpYear = wpDate.getFullYear();
        const wpMonths = wpDate.getMonth() + 1;
        const startMonthYear = new Date(startUnit.startDate).getFullYear();
        const monthDiff = (wpYear - startMonthYear) * 12;
        const paginationDiff = (currentPage - 1) * monthsPerPage;
        return monthDiff - diff + wpMonths - paginationDiff;
    }

    static calculateSubgridNumbers(
        task: TaskDto,
        wpLimit: WorkpackageLimitProps | null
    ): { start: number; end: number } | undefined {
        if (!task || !wpLimit || !task.startDate || !task.endDate) return undefined;
        const taskStartDateTmp = new Date(new Date(task.startDate).setDate(1));
        const taskEndDateTmp = new Date(new Date(task.endDate).setDate(1));
        const taskStartString = `${taskStartDateTmp.getFullYear()}-${
            taskStartDateTmp.getMonth() + 1
        }-${taskStartDateTmp.getDate()}`;
        const taskEndString = `${taskEndDateTmp.getFullYear()}-${
            taskEndDateTmp.getMonth() + 1
        }-${taskEndDateTmp.getDate()}`;
        const taskEndDate = new Date(taskEndString);
        const taskStartDate = new Date(taskStartString);
        const limitStartDate = new Date(wpLimit.startDate);
        const limitEndDate = new Date(wpLimit.endDate);
        if (taskStartDate <= limitEndDate && taskEndDate >= limitStartDate) {
            const adjustedStartDate =
                taskStartDate && taskStartDate < limitStartDate
                    ? limitStartDate
                    : taskStartDate;

            const adjustedEndDate =
                taskEndDate && taskStartDate > limitEndDate
                    ? limitEndDate
                    : taskEndDate;

            const start = new Date(adjustedStartDate);
            const end = new Date(adjustedEndDate);

            const taskStartYear = start.getFullYear();
            const taskStartMonth = start.getMonth() + 1;
            const taskEndYear = end.getFullYear();
            const taskEndMonth = end.getMonth() + 1;

            const monthsBetween =
                (taskEndYear - taskStartYear) * 12 +
                (taskEndMonth - taskStartMonth + 1);

            const limitStartYear = limitStartDate.getFullYear();
            const limiStartMonth = limitStartDate.getMonth() + 1;

            const yearDiff = (taskStartYear - limitStartYear) * 12;
            const monthDiff = taskStartMonth - limiStartMonth;

            const startNum = monthDiff + yearDiff;
            const endNum = startNum + monthsBetween;

            return {
                start: startNum + 1,
                end: endNum + 1,
            };
        }
        return undefined;
    }

    static returnWorkpackageLimit = (
        workpackage: WorkPackageDto,
        shownUnits: Array<ProjectStatisticsUnitDto> | undefined
    ): WorkpackageLimitProps | null => {
        if (!shownUnits || shownUnits.length === 0 || !shownUnits[0].startDate) {
            return null;
        }
        const startMonthDateStr = shownUnits[0].startDate;
        const endMonthDateStr = shownUnits[shownUnits.length - 1].startDate;

        const startMonthDate = startMonthDateStr
            ? new Date(startMonthDateStr)
            : null;
        const endMonthDate = endMonthDateStr ? new Date(endMonthDateStr) : null;

        const tempStartDate = workpackage.startDate
            ? new Date(workpackage.startDate)
            : null;
        const tempEndDate = workpackage.endDate
            ? new Date(workpackage.endDate)
            : null;

        const wpStartDate =
            tempStartDate &&
            new Date(tempStartDate?.getFullYear(), tempStartDate?.getMonth(), 1);
        const wpEndDate =
            tempEndDate &&
            new Date(tempEndDate.getFullYear(), tempEndDate.getMonth(), 1);

        if (!wpStartDate || !wpEndDate) {
            return null;
        }
        if (!endMonthDate || !startMonthDate) return null;

        if (wpStartDate <= endMonthDate && wpEndDate >= startMonthDate) {
            const adjustedStartDate =
                wpStartDate && wpStartDate < startMonthDate
                    ? startMonthDate
                    : wpStartDate;

            const adjustedEndDate =
                wpEndDate && wpEndDate > endMonthDate ? endMonthDate : wpEndDate;

            const startDateString = `${adjustedStartDate.getFullYear()}-${
                adjustedStartDate.getMonth() + 1
            }-${adjustedStartDate.getDate()}`;
            const endDateString = `${adjustedEndDate.getFullYear()}-${
                adjustedEndDate.getMonth() + 1
            }-${adjustedEndDate.getDate()}`;
            return {
                id: workpackage.id ?? "",
                startDate: startDateString,
                endDate: endDateString,
            };
        }
        return null;
    };

    static isCurrentMonthYear(unit: ProjectStatisticsUnitDto): boolean {
        if (!unit.startDate) return false;
        const date = new Date(unit.startDate);
        const dateMonth = date.getMonth() + 1;
        const dateYear = date.getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        return dateMonth === currentMonth && dateYear === currentYear;
    }

    static getPageNumbers = (
        currentPage: number,
        totalPages: number
    ): Array<number> => {
        const shownPages = 5;
        const pages: number[] = [];

        let startPage = Math.max(currentPage - Math.floor(shownPages / 2), 1);
        let endPage = startPage + shownPages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - shownPages + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    static constructValidRoutePath(
        fullPath: string,
        oldStr: string,
        newStr: string
    ): string {
        return fullPath.replace(oldStr, newStr);
    }

    static getYearNumber = (date: string) => {
        return new Date(date).getFullYear();
    };

    static returnYearCount = (
        units: Array<ProjectStatisticsUnitDto>
    ): Record<string, number> => {
        const countByYear: Record<string, number> = {};
        units.forEach((month) => {
            if (month.startDate) {
                const date = new Date(month.startDate);
                const name = date.getFullYear().toString();
                if (name !== "") {
                    if (countByYear.hasOwnProperty(name)) {
                        countByYear[name] += 1;
                    } else {
                        countByYear[name] = 1;
                    }
                }
            }
        });
        return countByYear;
    };

    static yearColumnLimit = (
        units: Array<ProjectStatisticsUnitDto>,
        toAdd: number
    ): Array<YearLimitProps> => {
        const years = this.returnYearCount(units);
        const limitArray: Array<YearLimitProps> = [];
        const entries = Object.entries(years);
        entries.forEach(([year, count], index) => {
            if (index === 0) {
                limitArray.push({
                    start: toAdd,
                    end: toAdd + count,
                    name: year,
                });
            } else {
                const previousEntry = limitArray[index - 1];
                const start = previousEntry.end;
                limitArray.push({
                    start: start,
                    end: start + count,
                    name: year,
                });
            }
        });
        return limitArray;
    };

    static numberFormatter = (number: number | undefined): string => {
        if (number === undefined) return "";
        return `${Intl.NumberFormat("eu").format(number).toString()}€`;
    };

    static numberToPercantage = (number: number | undefined): string => {
        if (number === undefined) return "";
        return `${number * 100}%`;
    };

    static getFirstOfYearMonth = (date: Date | string = new Date()): Date => {
        const currentDate = new Date(date);
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    };

    static getMonthYearCurrentDate = (): { year: string; month: string } => {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.toLocaleDateString("en-US", {month: "long"});
        return {year, month};
    };

    static getRelevantTasks = (
        workpackages: WorkPackageDto[] | undefined
    ): TaskDto[] => {
        const currDate = this.getFirstOfYearMonth();
        let tasks: TaskDto[] = [];
        workpackages?.forEach((workpackage) => {
            workpackage.tasks?.forEach((task) => {
                if (task.startDate && task.endDate) {
                    const start = this.getFirstOfYearMonth(new Date(task.startDate));
                    const end = this.getFirstOfYearMonth(new Date(task.endDate));
                    if (start <= currDate && currDate <= end) {
                        tasks.push(task);
                    }
                }
            });
        });
        return tasks;
    };

    static roundDownToTwoDecimalPlaces = (num: number) => {
        return Math.floor(num * 100) / 100;
    };

    static getWorkStatusColors = (unit: ProjectStatisticsUnitDto): string => {
        if (!unit.pmBurnDownRate) return "bg-c-teal bg-opacity-40";
        const pm = unit.pmBurnDownRate ?? 0;
        const total = unit.actualTotalWorkPm ?? 0;
        const percent = total / pm;
        if (percent < 0.9) return "bg-warning bg-opacity-40";
        if (total > pm) return "bg-danger bg-opacity-40";
        return "bg-c-teal bg-opacity-40";
    };

    static getSpendingStatusColors = (unit: ProjectStatisticsUnitDto): string => {
        if (!unit.staffBudgetBurnDownRate) return "bg-c-teal bg-opacity-40";
        const pm = unit.staffBudgetBurnDownRate ?? 0;
        const total = unit.actualMonthSpending ?? 0;
        const percent = total / pm;
        if (percent < 0.9) return "bg-warning bg-opacity-40";
        if (total > pm) return "bg-danger bg-opacity-40";
        return "bg-c-teal bg-opacity-40";
    };
    static getSpentBudgetProps = (
        stats: ProjectStatisticsResponse | undefined
    ): BudgetBreakdownChartProps => {
        const chartBudget = {
            usedBudget: 0,
            totalBudget: 0,
            percentage: 0,
        };
        if (!stats || !stats.units) return chartBudget;
        let spent = 0;
        let total = 0;
        stats.units.forEach((unit) => {
            spent += unit.actualMonthSpending ?? 0;
            total += unit.staffBudgetBurnDownRate ?? 0;
        });
        const percantage = this.roundDownToTwoDecimalPlaces(spent / total) * 100;
        return {
            usedBudget: this.roundDownToTwoDecimalPlaces(spent),
            totalBudget: this.roundDownToTwoDecimalPlaces(total),
            percentage: percantage,
        };
    };

    static convertDateToSI = (date: string) => {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        return `${year}-${day}-${month}`;
    };

    static convertBytesToMB = (size: number): number => {
        return Math.round((size / 1048576) * 100) / 100;
    };

    static fileTypeColorMap: { [key: string]: string } = {
        "application/pdf": "fill-red-600",
        "application/msword": "fill-c-blue",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "fill-c-blue",
        "application/vnd.ms-excel": "fill-green-700",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            "fill-green-700",
        "text/csv": "fill-green-700",
        "application/vnd.ms-powerpoint": "fill-orange-400",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            "fill-orange-400",
        "application/zip": "fill-purple-600",
        "application/vnd.rar": "fill-purple-600",
    };

    static returnFileTypeColor = (type: string): string => {
        return TextUtil.fileTypeColorMap[type] || "fill-gray-500";
    };

    static returnMonthYear = (dateStr: string): string => {
        const date = new Date(dateStr);
        const monthName = date.toLocaleString("default", {month: "long"});
        const year = date.getFullYear();
        return monthName + ", " + year;
    };

    static returnPersonAvailabilityByUnit = (person: PersonOnProjectDto, unit: ProjectStatisticsUnitDto): boolean => {
        if (person.toDate && person.fromDate && unit.startDate && unit.endDate) {
            const fromDate = new Date(person.fromDate).setDate(1);
            const toDate = new Date(person.toDate).setDate(1);
            const checkStartDate = new Date(unit.startDate).setDate(1);
            const checkEndDate = new Date(unit.endDate).setDate(1);
            return fromDate <= checkStartDate && toDate >= checkEndDate;
        } else return false;
    }
}

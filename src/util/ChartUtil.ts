import {ProjectListStatusResponse, ProjectStatisticsResponse, ProjectStatisticsUnitDto} from "../../temp_ts";
import {
    ActiveProjectsStateData,
    BudgetBreakdownTrackerData,
    CostTimelineChartProps, CurrentlyRelevantData, ReportPageChartData,
    UserDetailsChartData,
    WorkDetailsLineChartProps
} from "../interfaces";
import TextUtil from "./TextUtil";

export default class ChartUtil {
    static getWorkDetailsLineChartPm = (statistics: ProjectStatisticsResponse) => {
        const tooltipOptions = {
            ok: "You are in bounds of assigned PM.",
            over: "You are over assigned PM.",
            default: undefined
        }
        const totalArray: number[] = statistics.workPackages ? statistics.workPackages?.map(workpackgage => {
            return (workpackgage.assignedPM ?? 0);
        }) : []

        const actualArray: number [] = statistics.units ? statistics.units.map(unit => {
            return (unit.actualTotalWorkPm ?? 0)
        }) : []
        const total: number = totalArray.reduce((sum, current) => sum + current, 0);
        const actual: number = actualArray.reduce((sum, current) => sum + current, 0);
        const percentage: number = Math.floor((actual / total) * 100);
        let tooltip: string | undefined = tooltipOptions.default;
        if (percentage > 100)
            tooltip = tooltipOptions.over;
        else if (0 < percentage && percentage <= 100)
            tooltip = tooltipOptions.ok;
        return ({
            totalPm: TextUtil.roundDownToTwoDecimalPlaces(total),
            actualPm: TextUtil.roundDownToTwoDecimalPlaces(actual),
            pmPercentValue: TextUtil.roundDownToTwoDecimalPlaces(percentage),
            tooltipValue: tooltip
        })
    }

    static returnLineChartData = (units: Array<ProjectStatisticsUnitDto> | undefined): WorkDetailsLineChartProps[] => {
        if (units === undefined)
            return [];
        const currDate = TextUtil.getFirstOfYearMonth();
        const relevantMonths: Array<ProjectStatisticsUnitDto> = [];

        for (let i = 6; i <= units.length; i += 6) {
            const monthDateStr = units[i - 1]?.startDate;
            if (monthDateStr) {
                const monthDate = new Date(monthDateStr);
                if (currDate <= monthDate) {
                    relevantMonths.push(...units.slice(i - 6, i));
                    break;
                } else if (units.length < 6) {
                    relevantMonths.push(...units);
                    break;
                } else {
                    relevantMonths.push(...units.slice(-6))
                }
            }
        }
        return (relevantMonths.map(month => {
            return ({
                "date": TextUtil.refactorDate(month.startDate ?? ""),
                "PM per month": month.pmBurnDownRate ?? 0
            })
        }));
    }
    static returnCurrentMonthBarChartData = (statistics: ProjectStatisticsResponse): CurrentlyRelevantData => {
        const foundMonth = (statistics.units ?? []).find(unit => TextUtil.isCurrentMonthYear(unit));
        let actual: number = 0;
        let assigned: number = 0;
        if (foundMonth) {
            actual = foundMonth.actualTotalWorkPm ?? 0;
            assigned = foundMonth.pmBurnDownRate ?? 0;
        }
        let color: string = "teal"
        if (assigned < actual) {
            color = "red"
        }
        const chartData = [
            {
                name: "Workload",
                "Assigned": assigned,
                "Actual": actual
            }
        ]
        return ({
            chartData: chartData,
            barColor: ["blue", color],
            foundMonth: foundMonth
        })
    }

    static getCostTimelineChartData = (units: Array<ProjectStatisticsUnitDto>) => {
        const chartData: Array<CostTimelineChartProps> = [];
        const currDate = TextUtil.getFirstOfYearMonth();
        const relevantMonths: Array<ProjectStatisticsUnitDto> = [];
        for (let i = 6; i <= units.length; i += 6) {
            const monthDateStr = units[i - 1]?.startDate;
            if (monthDateStr) {
                const monthDate = new Date(monthDateStr);
                if (currDate <= monthDate) {
                    relevantMonths.push(...units.slice(i - 6, i));
                    break;
                }
            } else if (units.length < 6) {
                relevantMonths.push(...units);
                break;
            } else {
                relevantMonths.push(...units.slice(-6))
            }
        }
        relevantMonths.forEach(month => {
            chartData.push({
                date: TextUtil.refactorDate(month.startDate ?? ""),
                "Predicted cost": month.staffBudgetBurnDownRate ?? 0,
                "Actual cost": month.actualMonthSpending ?? 0

            })
        })
        return chartData;
    }

    static getBudgetBreakdownTrackerData = (stats: ProjectStatisticsResponse | undefined): Array<BudgetBreakdownTrackerData> => {
        if (!stats || !stats.units) return [];
        const getChartProps = (month: ProjectStatisticsUnitDto): { color: string, tooltip: string } | undefined => {
            if (month.staffBudgetBurnDownRate && month.actualMonthSpending) {
                if (month.staffBudgetBurnDownRate < month.actualMonthSpending) {
                    return {
                        tooltip: TextUtil.refactorDate(month.startDate) + ": Over estimated budget.",
                        color: "red"
                    };
                } else if (month.actualMonthSpending / month.staffBudgetBurnDownRate < 0.9) {
                    return {
                        tooltip: TextUtil.refactorDate(month.startDate) + ": Under 90% of estimated budget.",
                        color: "amber"
                    };
                } else {
                    return {
                        tooltip: TextUtil.refactorDate(month.startDate) + ": Right on budget.",
                        color: "green"
                    };
                }
            }
            if (month.staffBudgetBurnDownRate && (month.staffBudgetBurnDownRate > 0 && month.actualMonthSpending === 0)) {
                return {
                    tooltip: TextUtil.refactorDate(month.startDate) + ": Under 90% of estimated budget.",
                    color: "amber"
                };
            }
            return {
                tooltip: TextUtil.refactorDate(month.startDate) + ": No work needed.",
                color: "green"
            };
        }
        const relevantMonths: Array<ProjectStatisticsUnitDto> = [];
        const currDate = TextUtil.getFirstOfYearMonth();
        const trackerData: Array<BudgetBreakdownTrackerData> = []
        if (stats.units?.length < 24) {
            relevantMonths.push(...stats.units);
        } else {
            for (let i = 24; i < stats.units?.length; i += 24) {
                const monthDateStr = stats.units[i - 1]?.startDate;
                if (monthDateStr) {
                    const monthDate = new Date(monthDateStr);
                    if (currDate <= monthDate) {
                        relevantMonths.push(...stats.units.slice(i - 24, i));
                        break;
                    } else {
                        relevantMonths.push(...stats.units.slice(-24));
                        break;
                    }
                }
            }
        }
        relevantMonths.forEach(month => {
            const data = getChartProps(month);
            if (data) {
                trackerData.push({
                    color: data.color,
                    tooltip: data.tooltip
                })
            }
        })
        return trackerData;
    }

    static returnUserDetailsChartData = (data: ProjectListStatusResponse): Array<UserDetailsChartData> => {
        return ([
            {
                name: "Scheduled projects",
                value: data.scheduledProjects ?? 0
            },
            {
                name: "Ongoing projects",
                value: data.inProgressProjects ?? 0
            },
            {
                name: "Finished projects",
                value: data.finishedProjects ?? 0
            },
        ])
    }

    static returnCurrentYearBarChartData = (statistics: ProjectStatisticsResponse): CurrentlyRelevantData => {
        let actualPm = 0;
        let assignedPm = 0;
        const currentYear = new Date().getFullYear().toString();
        statistics.units?.forEach((unit) => {
            if (unit.startDate?.includes(currentYear)) {
                actualPm += unit.actualTotalWorkPm ?? 0;
                assignedPm += unit.pmBurnDownRate ?? 0;
            }
        })
        let color: string = "teal"
        if (assignedPm < actualPm) {
            color = "red"
        }
        const chartData = [
            {
                name: "Workload",
                "Assigned": TextUtil.roundDownToTwoDecimalPlaces(assignedPm),
                "Actual": TextUtil.roundDownToTwoDecimalPlaces(actualPm)
            }
        ]
        return ({
            chartData: chartData,
            barColor: ["blue", color],
        })
    }

    static getActiveProjectsBarChartData = (project: ProjectStatisticsResponse): ActiveProjectsStateData => {
        let actualPmYear = 0;
        let assignedPmYear = 0;
        let actualBudgetYear = 0;
        let assignedBudgetYear = 0;
        let actualPmMonth = 0;
        let assignedBudgetMonth = 0;
        let actualBudgetMonth = 0;
        let assignedPmMonth = 0;
        const currentYear = new Date().getFullYear().toString();
        const currentMonth = (new Date().getMonth() + 1).toString();
        const currentMonthName = new Date().toLocaleString('default', {month: 'long'});
        project.units?.forEach(unit => {
            if (unit.startDate?.includes(currentYear)) {
                assignedPmYear += unit.pmBurnDownRate ?? 0;
                actualPmYear += unit.actualTotalWorkPm ?? 0;
                actualBudgetYear += unit.actualMonthSpending ?? 0;
                assignedBudgetYear += unit.staffBudgetBurnDownRate ?? 0;
                if (unit.startDate?.includes(currentMonth)) {
                    actualPmMonth = unit.actualTotalWorkPm ?? 0;
                    assignedPmMonth = unit.pmBurnDownRate ?? 0;
                    actualBudgetMonth = unit.actualMonthSpending ?? 0;
                    assignedBudgetMonth = unit.staffBudgetBurnDownRate ?? 0;
                }
            }
        })
        return {
            dataPm: [
                {
                    name: currentYear,
                    Used: TextUtil.roundDownToTwoDecimalPlaces(actualPmYear),
                    Available: TextUtil.roundDownToTwoDecimalPlaces(assignedPmYear)
                },
                {
                    name: currentMonthName,
                    Used: TextUtil.roundDownToTwoDecimalPlaces(actualPmMonth),
                    Available: TextUtil.roundDownToTwoDecimalPlaces(assignedPmMonth)
                },

            ],
            dataBudget: [
                {
                    name: currentYear,
                    Used: TextUtil.roundDownToTwoDecimalPlaces(actualBudgetYear),
                    Available: TextUtil.roundDownToTwoDecimalPlaces(assignedBudgetYear)
                },
                {
                    name: currentMonthName,
                    Used: TextUtil.roundDownToTwoDecimalPlaces(actualBudgetMonth),
                    Available: TextUtil.roundDownToTwoDecimalPlaces(assignedBudgetMonth)
                },
            ]
        }
    }

    static getReportChartData = (units: Array<ProjectStatisticsUnitDto>): ReportPageChartData => {
        let currentMonthName = "";
        if (units.length === 1) {
            currentMonthName = new Date(units[0].startDate!).toLocaleString('default', {month: 'long'});
        } else {
            units.forEach((month, index) => {
                if (index === 0 || (index + 1) === units.length) {
                    if ((index + 1) === units.length) {
                        currentMonthName += " - "
                    }
                    currentMonthName += new Date(month.startDate!).toLocaleString('default', {month: 'long'});
                }
            })
        }
        let actualPm = 0;
        let totalPm = 0;
        let actualBudget = 0;
        let totalBudget = 0;
        units.forEach(month => {
            actualPm += month.actualTotalWorkPm!;
            totalPm += month.pmBurnDownRate!;
            totalBudget += month.staffBudgetBurnDownRate!;
            actualBudget += month.actualMonthSpending!;
        })
        return ({
            pmData: {
                name: currentMonthName,
                "Estimated": TextUtil.roundDownToTwoDecimalPlaces(totalPm),
                "Actual": TextUtil.roundDownToTwoDecimalPlaces(actualPm)
            }
            ,
            budgetData: {
                name: currentMonthName,
                "Estimated": TextUtil.roundDownToTwoDecimalPlaces(totalBudget),
                "Actual": TextUtil.roundDownToTwoDecimalPlaces(actualBudget)
            }
        })
    }
}
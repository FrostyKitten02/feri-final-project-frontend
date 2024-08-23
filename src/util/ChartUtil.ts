import {ProjectListStatusResponse, ProjectMonthDto, ProjectStatisticsResponse} from "../../temp_ts";
import {
    ActiveProjectsStateData,
    BudgetBreakdownTrackerData,
    CostTimelineChartProps, CurrentlyRelevantData,
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

        const actualArray: number [] = statistics.months ? statistics.months.map(month => {
            return (month.actualTotalWorkPm ?? 0)
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

    static returnLineChartData = (months: ProjectMonthDto [] | undefined): WorkDetailsLineChartProps[] => {
        if (months === undefined)
            return [];
        const currDate = TextUtil.getFirstOfYearMonth();
        const relevantMonths: ProjectMonthDto[] = [];

        for (let i = 6; i <= months.length; i += 6) {
            const monthDateStr = months[i - 1]?.date;
            if (monthDateStr) {
                const monthDate = new Date(monthDateStr);
                if (currDate <= monthDate) {
                    relevantMonths.push(...months.slice(i - 6, i));
                    break;
                } else if (months.length < 6) {
                    relevantMonths.push(...months);
                    break;
                } else {
                    relevantMonths.push(...months.slice(-6))
                }
            }
        }
        return (relevantMonths.map(month => {
            return ({
                "date": TextUtil.refactorDate(month.date ?? ""),
                "PM per month": month.pmBurnDownRate ?? 0
            })
        }));
    }
    static returnCurrentMonthBarChartData = (statistics: ProjectStatisticsResponse): CurrentlyRelevantData => {
        const foundMonth = (statistics.months ?? []).find(month => TextUtil.isCurrentMonthYear(month));
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

    static getCostTimelineChartData = (months: Array<ProjectMonthDto>) => {
        const chartData: Array<CostTimelineChartProps> = [];
        const currDate = TextUtil.getFirstOfYearMonth();
        const relevantMonths: ProjectMonthDto[] = [];
        for (let i = 6; i <= months.length; i += 6) {
            const monthDateStr = months[i - 1]?.date;
            if (monthDateStr) {
                const monthDate = new Date(monthDateStr);
                if (currDate <= monthDate) {
                    relevantMonths.push(...months.slice(i - 6, i));
                    break;
                }
            } else if (months.length < 6) {
                relevantMonths.push(...months);
                break;
            } else {
                relevantMonths.push(...months.slice(-6))
            }
        }
        relevantMonths.forEach(month => {
            chartData.push({
                date: TextUtil.refactorDate(month.date ?? ""),
                "Predicted cost": month.staffBudgetBurnDownRate ?? 0,
                "Actual cost": month.actualMonthSpending ?? 0

            })
        })
        return chartData;
    }

    static getBudgetBreakdownTrackerData = (stats: ProjectStatisticsResponse | undefined): Array<BudgetBreakdownTrackerData> => {
        if (!stats || !stats.months) return [];
        const getChartProps = (month: ProjectMonthDto): { color: string, tooltip: string } | undefined => {
            if (month.staffBudgetBurnDownRate && month.actualMonthSpending) {
                if (month.staffBudgetBurnDownRate < month.actualMonthSpending) {
                    return {
                        tooltip: TextUtil.refactorDate(month.date) + ": Over estimated budget.",
                        color: "red"
                    };
                } else if (month.actualMonthSpending / month.staffBudgetBurnDownRate < 0.9) {
                    return {
                        tooltip: TextUtil.refactorDate(month.date) + ": Under 90% of estimated budget.",
                        color: "amber"
                    };
                } else {
                    return {
                        tooltip: TextUtil.refactorDate(month.date) + ": Right on budget.",
                        color: "green"
                    };
                }
            }
            return {
                tooltip: TextUtil.refactorDate(month.date) + ": No work needed.",
                color: "green"
            };
        }
        const relevantMonths: ProjectMonthDto[] = [];
        const currDate = TextUtil.getFirstOfYearMonth();
        const trackerData: Array<BudgetBreakdownTrackerData> = []
        if (stats.months?.length < 24) {
            relevantMonths.push(...stats.months);
        } else {
            for (let i = 24; i < stats.months?.length; i += 24) {
                const monthDateStr = stats.months[i - 1]?.date;
                if (monthDateStr) {
                    const monthDate = new Date(monthDateStr);
                    if (currDate <= monthDate) {
                        relevantMonths.push(...stats.months.slice(i - 24, i));
                        break;
                    } else {
                        relevantMonths.push(...stats.months.slice(-24));
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
        statistics.months?.forEach((month) => {
            if (month.date?.includes(currentYear)) {
                actualPm += month.actualTotalWorkPm ?? 0;
                assignedPm += month.pmBurnDownRate ?? 0;
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
        const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
        project.months?.forEach(month => {
            if(month.date?.includes(currentYear)){
                assignedPmYear += month.pmBurnDownRate ?? 0;
                actualPmYear += month.actualTotalWorkPm ?? 0;
                actualBudgetYear += month.actualMonthSpending ?? 0;
                assignedBudgetYear += month.staffBudgetBurnDownRate ?? 0;
                if (month.date?.includes(currentMonth)){
                    actualPmMonth = month.actualTotalWorkPm ?? 0;
                    assignedPmMonth = month.pmBurnDownRate ?? 0;
                    actualBudgetMonth = month.actualMonthSpending ?? 0;
                    assignedBudgetMonth = month.staffBudgetBurnDownRate ?? 0;
                }
            }
        })
        return {
            dataPm: [
                {
                    name: currentYear,
                    Used: actualPmYear,
                    Available: assignedPmYear
                },
                {
                    name: currentMonthName,
                    Used: actualPmMonth,
                    Available: assignedPmMonth
                },

            ],
            dataBudget: [
                {
                    name: currentYear,
                    Used: actualBudgetYear,
                    Available: assignedBudgetYear
                },
                {
                    name: currentMonthName,
                    Used: actualBudgetMonth,
                    Available: assignedBudgetMonth
                },
            ]
        }
    }
}
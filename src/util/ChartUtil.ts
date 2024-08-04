import {ProjectMonthDto, ProjectStatisticsResponse} from "../../temp_ts";
import {CostTimelineChartProps, WorkDetailsLineChartProps} from "../interfaces";
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
                }
            }
        }
        return (relevantMonths.map(month => {
            return ({
                "date": month.date ?? "",
                "pmPerMonth": month.pmBurnDownRate ?? 0
            })
        }));
    }
    static returnCurrentMonthBarChartData = (statistics: ProjectStatisticsResponse) => {
        const foundMonth = (statistics.months ?? []).find(month => TextUtil.isCurrentMonthYear(month));
        let actual: number = 0;
        let assigned: number = 0;
        if(foundMonth){
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
                "Assigned PM": assigned,
                "Actual PM": actual
            }
        ]
        return({
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
            }
        }
        relevantMonths.forEach(month => {
            chartData.push({
                date: month.date ?? "",
                "Predicted cost": 2000,
                "Actual cost": month.actualMonthSpending ?? 0

            })
        })
        return chartData;
    }
}
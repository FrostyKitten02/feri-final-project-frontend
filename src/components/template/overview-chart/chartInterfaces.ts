import {ReactNode} from "react";
import {ProjectMonthDto, ProjectStatisticsResponse} from "../../../../temp_ts";

export interface OverviewChartProps {
    monthsPerPage: number,
    children?: ReactNode,
}

export interface OverviewChartHeaderProps {
    months: Array<ProjectMonthDto> | undefined
    currentPage: number,
    monthsPerPage: number
}

export interface OverviewChartBodyProps {
    statistics: ProjectStatisticsResponse,
    children?: ReactNode,
    currentPage: number,
    monthsPerPage: number
}
import {ReactNode} from "react";
import {ProjectStatisticsResponse, ProjectStatisticsUnitDto} from "../../../../client";

export interface OverviewChartProps {
    monthsPerPage: number,
    workpackageCount: number,
    children?: ReactNode,
}

export interface OverviewChartHeaderProps {
    months: Array<ProjectStatisticsUnitDto> | undefined
    currentPage: number,
    monthsPerPage: number
}

export interface OverviewChartBodyProps {
    statistics: ProjectStatisticsResponse,
    children?: ReactNode,
    currentPage: number,
    monthsPerPage: number
}
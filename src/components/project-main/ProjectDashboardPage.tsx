import React, {ReactNode, useEffect, useState} from "react";
import {ProjectMonthDto, ProjectStatisticsResponse} from "../../../temp_ts";
import {projectAPI} from "../../util/ApiDeclarations";
import {useRequestArgs} from "../../util/CustomHooks";
import {useParams} from "react-router-dom";
import TextUtil from "../../util/TextUtil";

export const ProjectDashboardPage = () => {
    const [statistics, setStatistics] = useState<ProjectStatisticsResponse>({workPackages: [], months: []})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [monthsPerPage, setMonthsPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();

    useEffect(() => {
        const getStatistics = async (): Promise<void> => {
            if (!projectId)
                return;
            try {
                const response = await projectAPI.getProjectStatistics(
                    projectId,
                    requestArgs
                )
                if (response.status === 200) {
                    setStatistics(response.data);
                    setIsLoading(false);
                }
            } catch (error: any) {
            }
        }
        getStatistics();
    }, [])
    return (
        <div className="flex flex-col w-full p-5">
            <div>
                PROJECT DASHBOARD
            </div>
            <div>
                {
                    isLoading ? "loading" :
                        <OverviewChart monthsPerPage={monthsPerPage}>
                            <OverviewChartHeader months={statistics.months} currentPage={currentPage} monthsPerPage={monthsPerPage}>

                            </OverviewChartHeader>
                            <OverviewChartBody statistics={statistics}>

                            </OverviewChartBody>
                        </OverviewChart>
                }
            </div>
        </div>
    )
}

export interface OverviewChartProps {
    monthsPerPage: number,
    children?: ReactNode,
}

const OverviewChart = ({monthsPerPage, children}: OverviewChartProps) => {
    return (
        <div className="p-5">
            <div className={`grid flex`}
                 style={{
                     gridTemplateColumns: `repeat(${monthsPerPage + 4}, minmax(0, 1fr))`
                 }}
            >
                {children}
            </div>
        </div>
    )
}

export interface OverviewChartHeaderProps {
    months: Array<ProjectMonthDto> | undefined
    currentPage: number,
    monthsPerPage: number
}

const OverviewChartHeader = ({months}: OverviewChartHeaderProps) => {
    if (!months)
        return;

    return (
        <React.Fragment>
            <div className="flex col-start-3 col-span-1 justify-center items-center">
                PM
            </div>
            {
                months.map(month => {
                    return (
                        <div key={month.monthNumber}
                             className={`${month.monthNumber && month.monthNumber % 2 === 0 ? "bg-blue-200" : "bg-transparent"} justify-center items-center justify-center flex items-center`}>
                            <div className="text-xs font-mono">
                                M{month.monthNumber}
                            </div>
                            <div className="uppercase text-xl font-mono pl-2">
                                {TextUtil.getMonthAbbreviation(month?.date)}
                            </div>
                        </div>
                    )
                })
            }
            <div className="flex justify-center items-center">
                end
            </div>
        </React.Fragment>
    )
}

export interface OverviewChartBodyProps {
    statistics: ProjectStatisticsResponse,
    children?: ReactNode,
}

const OverviewChartBody = ({statistics}: OverviewChartBodyProps) => {
    const startMonth = statistics.months?.[0];
    return (
        <>
            {
                statistics.workPackages?.map(workPackage => {
                    return (
                        <React.Fragment key={workPackage.id}>
                            <div className="col-start-1 col-span-2">
                                {workPackage.title}
                            </div>
                            {
                                workPackage.tasks?.map(task => {
                                    return (
                                        <React.Fragment key={task.id}>
                                            <div className="grid grid-cols-subgrid bg-red-200 p-2"
                                                 key={workPackage.id}
                                                 style={{
                                                     gridColumnStart: TextUtil.getMonthNumber(workPackage.startDate, startMonth) + 3,
                                                     gridColumnEnd: TextUtil.getMonthNumber(workPackage.endDate, startMonth) + 4
                                                 }}
                                            >
                                                <div className="bg-blue-200"
                                                     style={{
                                                         gridColumnStart: TextUtil.calculateSubgridNumber(workPackage, task.startDate),
                                                         gridColumnEnd: TextUtil.calculateSubgridNumber(workPackage, task.endDate) + 1
                                                     }}>
                                                    {task.title}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </React.Fragment>
                    )
                })
            }
        </>
    )
}
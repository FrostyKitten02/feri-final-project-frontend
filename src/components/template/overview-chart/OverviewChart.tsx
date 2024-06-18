import React from "react";
import TextUtil from "../../../util/TextUtil";
import {OverviewChartBodyProps, OverviewChartHeaderProps, OverviewChartProps} from "./chartInterfaces";

export const OverviewChart = ({monthsPerPage, children}: OverviewChartProps) => {
    return (
        <div className="p-5">
            <div className={`grid flex`}
                 style={{
                     gridTemplateColumns: `repeat(${monthsPerPage + 2}, minmax(0, 1fr))`
                 }}
            >
                {children}
            </div>
        </div>
    )
}

export const OverviewChartHeader = ({months, currentPage, monthsPerPage}: OverviewChartHeaderProps) => {
    if (!months)
        return;

    const startIndex = (currentPage - 1) * monthsPerPage;
    const shownMonths = months.slice(startIndex, startIndex + monthsPerPage);
    const currentMonthClass = `bg-blue-200 p-2 rounded-lg`;

    return (
        <React.Fragment>
            <div className="col-start-1 col-span-2 h-14" />
            {
                shownMonths.map(month => {
                    return (
                        <div key={month.monthNumber}
                             className={`h-14 justify-center flex items-center`}>
                            <div className={`${TextUtil.isCurrentMonth(month) && currentMonthClass} justify-center flex items-center`}>
                                <div className="text-xs font-mono">
                                    M{month.monthNumber}
                                </div>
                                <div className="uppercase text-xl font-mono pl-2">
                                    {TextUtil.getMonthAbbreviation(month?.date)}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </React.Fragment>
    )
}

export const OverviewChartBody = ({statistics, currentPage, monthsPerPage}: OverviewChartBodyProps) => {
    const startIndex = (currentPage - 1) * monthsPerPage;
    const shownMonths = statistics.months?.slice(startIndex, startIndex + monthsPerPage);
    const startMonth = shownMonths && shownMonths[0];
    const endMonth = shownMonths && shownMonths[shownMonths.length - 1];
    return (
        <React.Fragment>
            {
                statistics.workPackages?.map(workPackage => {
                    const wpLimit = TextUtil.returnWorkpackageLimit(workPackage, shownMonths);
                    return (
                        <React.Fragment key={workPackage.id}>
                            <div className="col-start-1 col-span-2 h-14 bg-blue-200">
                                {workPackage.title}
                            </div>
                            {
                                workPackage.tasks?.map(task => {
                                    return (
                                        wpLimit &&
                                        <React.Fragment key={task.id}>
                                            <div className="grid grid-cols-subgrid bg-red-200 h-14"
                                                 key={workPackage.id}
                                                 style={{
                                                     gridColumnStart: TextUtil.getMonthNumber(wpLimit.startDate, startMonth, currentPage, monthsPerPage) + 2,
                                                     gridColumnEnd: TextUtil.getMonthNumber(wpLimit.endDate, endMonth, currentPage, monthsPerPage) + 3
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
        </React.Fragment>
    )
}
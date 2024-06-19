import React from "react";
import TextUtil from "../../../util/TextUtil";
import {OverviewChartBodyProps, OverviewChartHeaderProps, OverviewChartProps} from "./chartInterfaces";

export const OverviewChart = ({monthsPerPage, workpackageCount, children}: OverviewChartProps) => {
    if (workpackageCount === 0)
        return;
    return (
        <div className="p-5">
            <div className={`grid flex`}
                 style={{
                     gridTemplateColumns: `repeat(${monthsPerPage + 3}, minmax(0, 1fr))`
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
            <div className="col-start-1 col-span-2 h-14"/>
            <div className="h-14 justify-center flex items-center uppercase text-xl font-mono pl-2">
                PM
            </div>
            {
                shownMonths.map(month => {
                    return (
                        <div key={month.monthNumber}
                             className={`h-14 justify-center flex items-center`}>
                            <div
                                className={`${TextUtil.isCurrentMonth(month) && currentMonthClass} justify-center flex items-center`}>
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
                            <div className="flex justify-between items-center col-start-1 col-span-2 h-14">
                                <div className="flex-grow flex items-center justify-center text-lg font-bold">
                                    <span>
                                        {TextUtil.truncateString(workPackage.title, 40)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-full px-3">
                                    <span className="text-xl font-mono flex justify-center items-center h-full">
                                       {workPackage.assignedPM}
                                    </span>
                            </div>
                            {
                                workPackage.tasks?.map(task => {
                                    const subgridNumbers = TextUtil.calculateSubgridNumbers(task, wpLimit);
                                    return (
                                        wpLimit &&
                                        <React.Fragment key={task.id}>
                                            <div className="grid grid-cols-subgrid bg-gray-50 h-14"
                                                 key={workPackage.id}
                                                 style={{
                                                     gridColumnStart: TextUtil.getMonthNumber(wpLimit.startDate, startMonth, currentPage, monthsPerPage) + 3,
                                                     gridColumnEnd: TextUtil.getMonthNumber(wpLimit.endDate, endMonth, currentPage, monthsPerPage) + 4
                                                 }}
                                            >{
                                                subgridNumbers &&
                                                <div className="flex p-2"
                                                     style={{
                                                         gridColumnStart: subgridNumbers.start,
                                                         gridColumnEnd: subgridNumbers.end
                                                     }}>
                                                    <div className="flex justify-center items-center bg-red-200 flex-grow rounded-lg">
                                                        {task.title}
                                                    </div>
                                                </div>
                                            }
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
import React from "react";
import TextUtil from "../../../util/TextUtil";
import {OverviewChartBodyProps, OverviewChartHeaderProps, OverviewChartProps} from "./chartInterfaces";
import {YearLimitProps} from "../../../interfaces";

export const OverviewChart = ({monthsPerPage, workpackageCount, children}: OverviewChartProps) => {
    if (workpackageCount === 0)
        return (
            <div className="h-full flex flex-col justify-center items-center">
                <p className="text-2xl font-bold">
                    There are currently no work packages included in this project.
                </p>
                <p>
                    Navigate to work packages & tasks to add them to the project.
                </p>
            </div>
        )
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
    const currentMonthClass = `bg-blue-200 w-28 rounded-lg`;
    const years: Array<YearLimitProps> = TextUtil.yearColumnLimit(shownMonths, 4);
    const emptyColumnsCount = monthsPerPage - shownMonths.length;

    return (
        <React.Fragment>
            <div className="col-start-1 col-span-3 h-14"/>
            {
                years.map((year, index) => {
                    return (
                        <div
                            className="p-2"
                            key={index}
                            style={{
                                gridColumnStart: year.start,
                                gridColumnEnd: year.end
                            }}
                        >
                            <div className="relative flex-grow h-full">
                                <div className="absolute mt-[4px] flex w-full justify-center items-center rounded-lg border-[1px] h-full border-solid z-10">
                                    <div className="bg-white rounded-lg px-2 font-medium">
                                        {year.name}
                                    </div>
                                </div>
                                <div className={`${index % 2 === 0 ? "bg-red-50" : "bg-blue-50"} absolute ml-[4px] w-full h-full rounded-lg z-5`} />
                            </div>
                        </div>
                    )
                })
            }
            {
                emptyColumnsCount > 0 &&
                Array.from({length: emptyColumnsCount}).map((_, index) => (
                    <div key={index}/>
                ))
            }
            <div className="col-start-1 col-span-2 h-14"/>
            <div className="h-20 justify-center flex items-center uppercase text-xl font-mono pl-2">
                PM
            </div>
            {
                shownMonths.map(month => {
                    return (
                        <div key={month.monthNumber}
                             className={`h-20 relative justify-center flex items-center`}>
                            <div
                                className={`${TextUtil.isCurrentMonthYear(month) && currentMonthClass} justify-center h-12 absolute flex items-center`}>
                                <div className="text-xs font-mono">
                                    M{month.monthNumber}
                                </div>
                                <div className="uppercase text-xl font-mono mx-2">
                                    {TextUtil.getMonthAbbreviation(month?.date)}
                                </div>
                                <div className="text-xs font-mono rounded-lg bg-white px-2">
                                    {month.pmBurnDownRate}PM
                                </div>
                            </div>
                            <div className={`${TextUtil.isCurrentMonthYear(month) && "absolute h-12 border-[1px] mr-1 mt-1 border-solid rounded-lg w-28"}`} />
                            <button className="absolute h-12 w-28" />
                        </div>
                    )
                })
            }
            {
                emptyColumnsCount > 0 &&
                Array.from({length: emptyColumnsCount}).map((_, index) => (
                    <div key={index} />
                ))
            }
        </React.Fragment>
    )
}

export const OverviewChartBody = ({statistics, currentPage, monthsPerPage}: OverviewChartBodyProps) => {
    const startIndex = (currentPage - 1) * monthsPerPage;
    const shownMonths = statistics.months ? statistics.months.slice(startIndex, startIndex + monthsPerPage) : [];
    const startMonth = shownMonths && shownMonths[0];
    const endMonth = shownMonths && shownMonths[shownMonths.length - 1];
    const emptyColumnsCount = monthsPerPage - shownMonths.length;
    const startEmptyColumn = shownMonths.length + 4;
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
                                workPackage.tasks ?
                                    workPackage.tasks.map(task => {
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
                                                        <div
                                                            className="flex justify-center items-center bg-red-200 flex-grow rounded-lg">
                                                            {task.title}
                                                        </div>
                                                    </div>
                                                }
                                                </div>
                                            </React.Fragment>
                                        )
                                    }) :
                                    <>
                                        {
                                            wpLimit &&
                                            <React.Fragment key={workPackage.id}>
                                                <div className="grid grid-cols-subgrid bg-gray-50 h-14"
                                                     key={workPackage.id}
                                                     style={{
                                                         gridColumnStart: TextUtil.getMonthNumber(wpLimit.startDate, startMonth, currentPage, monthsPerPage) + 3,
                                                         gridColumnEnd: TextUtil.getMonthNumber(wpLimit.endDate, endMonth, currentPage, monthsPerPage) + 4
                                                     }}
                                                />
                                            </React.Fragment>
                                        }
                                    </>
                            }
                            {
                                emptyColumnsCount > 0 &&
                                Array.from({length: emptyColumnsCount}).map((_, index) => (
                                    <div key={index} style={{
                                        gridColumnStart: startEmptyColumn,
                                        gridColumnEnd: startEmptyColumn + emptyColumnsCount
                                    }}/>
                                ))
                            }
                        </React.Fragment>
                    )
                })
            }
        </React.Fragment>
    )
}
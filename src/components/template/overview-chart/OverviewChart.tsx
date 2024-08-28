import React from "react";
import TextUtil from "../../../util/TextUtil";
import {OverviewChartBodyProps, OverviewChartHeaderProps, OverviewChartProps} from "./chartInterfaces";
import {YearLimitProps} from "../../../interfaces";
import {GoTriangleRight} from "react-icons/go";
import { FaChartBar } from "react-icons/fa6";

export const OverviewChart = ({monthsPerPage, workpackageCount, children}: OverviewChartProps) => {
    if (workpackageCount === 0)
        return (
            <div className="h-full flex-grow flex flex-col justify-center items-center">
                <FaChartBar className="fill-muted size-40 pb-6"/>
                <p className="text-2xl font-bold text-muted">
                    There are currently no work packages included in this project.
                </p>
                <p className="text-muted">
                    Navigate to work packages to add them to the project.
                </p>
            </div>
        )
    return (
        <div className="px-5 flex-grow">
            <div className={`grid flex`}
                 style={{
                     gridTemplateColumns: `repeat(${monthsPerPage}, minmax(0, 1fr))`
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
    const years: Array<YearLimitProps> = TextUtil.yearColumnLimit(shownMonths, 1);
    const emptyColumnsCount = monthsPerPage - shownMonths.length;

    return (
        <React.Fragment>
            {
                years.map((year, index) => {
                    return (
                        <div
                            className="h-10"
                            key={index}
                            style={{
                                gridColumnStart: year.start,
                                gridColumnEnd: year.end
                            }}
                        >
                            <div
                                className={`${index % 2 === 0 ? "bg-c-blue" : "bg-c-sky"} flex mx-2 text-xl bg-opacity-50 rounded-lg items-center justify-center flex-grow h-full`}
                            >
                                <div className="bg-white mx-5 text-sm text-center rounded-lg px-2 font-medium">
                                    {year.name}
                                </div>
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
            {
                shownMonths.map(month => {
                    return (
                        <div
                            key={month.unitNumber}
                            className={`h-20 relative justify-center flex items-center`}
                        >
                            <div className={`${TextUtil.isCurrentMonthYear(month) && "bg-c-violet bg-opacity-30 pl-4 py-1 pr-2 rounded-lg "} flex`}>
                                <div className="relative h-full flex items-center">
                                    <div className="text-xs absolute w-20 flex justify-center left-[-45px] transform rotate-[270deg]">
                                        M{month.unitNumber}
                                    </div>
                                    <div className="uppercase text-3xl mx-2">
                                        {TextUtil.getMonthAbbreviation(month?.startDate)}
                                    </div>
                                </div>
                                <div
                                    className={`justify-center flex flex-col items-center`}>
                                        <div className={`text-xs text-center rounded-lg`}>
                                            {TextUtil.roundDownToTwoDecimalPlaces(month.pmBurnDownRate ?? 0) + " PM"}
                                        </div>
                                </div>
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
        </React.Fragment>
    )
}

export const OverviewChartBody = ({statistics, currentPage, monthsPerPage}: OverviewChartBodyProps) => {
    const startIndex = (currentPage - 1) * monthsPerPage;
    const shownMonths = statistics.units ? statistics.units.slice(startIndex, startIndex + monthsPerPage) : [];
    const startMonth = shownMonths && shownMonths[0];
    const endMonth = shownMonths && shownMonths[shownMonths.length - 1];
    const emptyColumnsCount = monthsPerPage - shownMonths.length;
    const startEmptyColumn = shownMonths.length + 1;
    return (
        <React.Fragment>
            {
                statistics.workPackages?.map((workPackage, wpIndex) => {
                    const wpLimit = TextUtil.returnWorkpackageLimit(workPackage, shownMonths);
                    return (
                        <React.Fragment key={wpIndex}>
                            {
                                workPackage.tasks ?
                                    workPackage.tasks.map((task, taskIndex) => {
                                        const subgridNumbers = TextUtil.calculateSubgridNumbers(task, wpLimit);
                                        return (
                                            wpLimit &&
                                            <React.Fragment key={wpIndex + taskIndex}>

                                                <div
                                                    className={
                                                        `grid ${(taskIndex === 0) && "mt-10 rounded-t-lg"} 
                                                        ${(taskIndex + 1) === workPackage.tasks?.length && "rounded-b-lg"}
                                                        ${(wpIndex % 3 === 0) ? "bg-c-cyan" : (wpIndex % 3 === 1) ? "bg-c-sky" : "bg-c-violet"}
                                                        relative items-end grid-cols-subgrid bg-opacity-30 h-14`
                                                    }
                                                    key={workPackage.id}
                                                    style={{
                                                        gridColumnStart: TextUtil.getMonthNumber(wpLimit.startDate, startMonth, currentPage, monthsPerPage),
                                                        gridColumnEnd: TextUtil.getMonthNumber(wpLimit.endDate, endMonth, currentPage, monthsPerPage) + 1
                                                    }}
                                                >
                                                    {
                                                        subgridNumbers &&
                                                        <div className="flex p-2 h-14"
                                                             style={{
                                                                 gridColumnStart: subgridNumbers.start,
                                                                 gridColumnEnd: subgridNumbers.end
                                                             }}>
                                                            <div
                                                                className={`flex ${(wpIndex % 3 === 0) ? "bg-c-cyan" : (wpIndex % 3 === 1) ? "bg-c-sky" : "bg-c-violet"} justify-center items-center flex-grow rounded-lg`}>
                                                                <div
                                                                    className="bg-white text-sm px-2 font-semibold rounded-lg">
                                                                    {TextUtil.truncateString(task.title, 50)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div
                                                        className={`${(taskIndex > 0) && "hidden"} flex absolute top-[-25px]`}>
                                                        <div className="pt-[2px]">
                                                            <GoTriangleRight/>
                                                        </div>
                                                        <div className="text-sm font-semibold px-1">
                                                            {TextUtil.truncateString(workPackage.title, 50)}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`${(taskIndex > 0) && "hidden"} flex w-[60px] transform justify-end rotate-[270deg] top-[25px] left-[-43px] absolute`}>
                                                        <div className="text-sm font-semibold">
                                                            {workPackage.assignedPM + " PM"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    }) :
                                    <>
                                        {
                                            wpLimit &&
                                            <React.Fragment key={workPackage.id}>
                                                <div
                                                    className={`grid mt-10 relative rounded-lg grid-cols-subgrid bg-opacity-30 h-14 ${(wpIndex % 3 === 0) ? "bg-c-cyan" : (wpIndex % 3 === 1) ? "bg-c-sky" : "bg-c-violet"}`}
                                                    key={workPackage.id}
                                                    style={{
                                                        gridColumnStart: TextUtil.getMonthNumber(wpLimit.startDate, startMonth, currentPage, monthsPerPage),
                                                        gridColumnEnd: TextUtil.getMonthNumber(wpLimit.endDate, endMonth, currentPage, monthsPerPage) + 1
                                                    }}
                                                >
                                                    <div className={`absolute flex top-[-25px]`}>
                                                        <div className="pt-[2px]">
                                                            <GoTriangleRight/>
                                                        </div>
                                                        <div className="text-sm font-semibold px-1">
                                                            {TextUtil.truncateString(workPackage.title, 55)}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`flex w-[60px] transform justify-end rotate-[270deg] top-[25px] left-[-43px] absolute`}>
                                                        <div className="text-sm font-semibold">
                                                            {workPackage.assignedPM + " PM"}
                                                        </div>
                                                    </div>
                                                </div>
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
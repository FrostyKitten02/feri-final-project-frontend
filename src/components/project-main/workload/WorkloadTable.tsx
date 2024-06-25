import {WorkloadTableProps, YearLimitProps} from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import * as React from "react";

export const WorkloadTable = ({statistics, currentPage, monthsPerPage}: WorkloadTableProps) => {
    if (!statistics.months)
        return;
    const startIndex = (currentPage - 1) * monthsPerPage;
    const shownMonths = statistics.months.slice(startIndex, startIndex + monthsPerPage);
    const currentMonthClass = `bg-blue-200 p-2 rounded-lg`;
    const years: Array<YearLimitProps> = TextUtil.yearColumnLimit(shownMonths, 2);
    return (
        <div className="grid p-5 border-[1px] border-gray-200 border-solid rounded-[20px]"
             style={{
                 gridTemplateColumns: `repeat(${monthsPerPage + 1}, minmax(0, 1fr))`,
             }}
        >
            {
                years.map((year, index) => {
                    return (
                        <div
                            className="p-2 h-14"
                            key={index}
                            style={{
                                gridColumnStart: year.start,
                                gridColumnEnd: year.end
                            }}
                        >
                            <div
                                className={`${index % 2 === 0 ? "bg-red-50" : "bg-blue-50"} flex text-xl rounded-lg items-center justify-center flex-grow h-full`}>
                                {year.name}
                            </div>
                        </div>
                    )
                })
            }
            <div className="col-start-1 col-span-1"/>
            {
                shownMonths.map(month => {
                    return (
                        <div key={month.monthNumber}
                             className={`h-14 justify-center flex items-center border-solid`}>
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
            <div className="flex items-center uppercase text-sm h-14">
                PM burndown rate
            </div>
            {
                shownMonths.map(month => {
                    return (
                        <div className="flex text-xl h-14 justify-center border-solid items-center">
                            {month.pmBurnDownRate}
                        </div>
                    )
                })
            }
            {
                Array.from({length: shownMonths[0]?.personWork?.length || 0}, (_, indexPerson) => (
                    <React.Fragment key={indexPerson}>
                        <div className="h-14 flex items-center uppercase text-sm">
                            {TextUtil.truncateString(shownMonths[0]?.personWork?.[indexPerson]?.personId, 20) }
                        </div>
                        {
                            shownMonths.map((month, index) => {
                                return (
                                    <div className="flex h-14 items-center justify-center border-solid" key={index}>
                                        <button className="flex-grow text-xl h-full hover:bg-gray-100 transition delay-50">
                                            {month.personWork?.[indexPerson].occupancyId !== null ? month.personWork?.[indexPerson].totalWorkPm : 0}
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </React.Fragment>
                ))
            }
            <div className="flex h-14 uppercase text-sm items-center">
                Total work
            </div>
            {
                shownMonths.map(month => {
                    return(
                        <div className="flex h-14 text-xl justify-center border-solid items-center">
                            {month.actualTotalWorkPm}
                        </div>
                    )
                })
            }
            <div className="flex h-14 uppercase text-sm items-center">
                Total spending
            </div>
            {
                shownMonths.map(month => {
                    return(
                        <div className="flex h-14 justify-center text-xl border-solid items-center">
                            {month.actualMonthSpending}
                        </div>
                    )
                })
            }
        </div>
    )
}
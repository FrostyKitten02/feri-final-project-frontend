import { WorkloadTableProps } from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import * as React from "react";
import {useMemo, useState} from "react";
import { WorkloadModal } from "./WorkloadModal";
import {PersonWorkDto} from "../../../../temp_ts";
export const WorkloadTable = ({ statistics, currentPage, monthsPerPage, handleEdit }: WorkloadTableProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedPerson, setSelectedPerson] = useState<PersonWorkDto>({});
    const handleButtonOpen = (month: string | undefined, person: PersonWorkDto | undefined) => {
        if(month !== undefined && person !== undefined){
            setOpen(true);
            setSelectedMonth(month);
            setSelectedPerson(person);
        }
    }
    const { shownMonths, emptyColumnsCount, years } = useMemo(() => {
        if (!statistics.months)
            return { shownMonths: [], startIndex: 0, emptyColumnsCount: 0, years: [] };

        const startIndex = (currentPage - 1) * monthsPerPage;
        const shownMonths = statistics.months.slice(startIndex, startIndex + monthsPerPage);
        const emptyColumnsCount = monthsPerPage - shownMonths.length;
        const years = TextUtil.yearColumnLimit(shownMonths, 2);

        return { shownMonths, emptyColumnsCount, years };
    }, [statistics.months, currentPage, monthsPerPage]);

    return (
        <div className="grid"
             style={{
                 gridTemplateColumns: `repeat(${monthsPerPage + 1}, minmax(0, 1fr))`,
             }}
        >
            {years.map((year, index) => (
                <div
                    className="p-2 h-14"
                    key={index}
                    style={{
                        gridColumnStart: year.start,
                        gridColumnEnd: year.end,
                    }}
                >
                    <div
                        className={`${index % 2 === 0 ? "bg-red-50" : "bg-blue-50"} flex text-xl rounded-lg items-center justify-center flex-grow h-full`}
                    >
                        {year.name}
                    </div>
                </div>
            ))}

            {emptyColumnsCount > 0 &&
                Array.from({ length: emptyColumnsCount }).map((_, index) => (
                    <div key={`empty-year-${index}`} />
                ))
            }

            <div className="col-start-1 col-span-1" />

            {shownMonths.map((month) => (
                <div key={`month-${month.monthNumber}`} className="h-14 justify-center flex items-center border-solid">
                    <div className={`${TextUtil.isCurrentMonthYear(month) && `bg-blue-200 p-2 rounded-lg`} justify-center flex items-center`}>
                        <div className="text-xs font-mono">
                            M{month.monthNumber}
                        </div>
                        <div className="uppercase text-xl font-mono pl-2">
                            {TextUtil.getMonthAbbreviation(month?.date)}
                        </div>
                    </div>
                </div>
            ))}

            {emptyColumnsCount > 0 &&
                Array.from({ length: emptyColumnsCount }).map((_, index) => (
                    <div key={`empty-month-${index}`} />
                ))
            }

            <div className="flex items-center uppercase text-sm h-14">
                PM burndown rate
            </div>

            {shownMonths.map((month, index) => (
                <div key={`burndown-${index}`} className="flex text-xl h-14 justify-center border-solid items-center">
                    {month.pmBurnDownRate}
                </div>
            ))}

            {emptyColumnsCount > 0 &&
                Array.from({ length: emptyColumnsCount }).map((_, index) => (
                    <div key={`empty-burndown-${index}`} />
                ))
            }

            {Array.from({ length: shownMonths[0]?.personWork?.length || 0 }, (_, indexPerson) => (
                <React.Fragment key={`person-${indexPerson}`}>
                    <div className="h-14 flex items-center uppercase text-sm">
                        {TextUtil.truncateString(shownMonths[0]?.personWork?.[indexPerson]?.personId, 20)}
                    </div>
                    {shownMonths.map((month, monthIndex) => (
                        <div key={`person-work-${indexPerson}-${monthIndex}`} className="flex h-14 items-center justify-center border-solid">
                            <button onClick={() => handleButtonOpen(month.date, month.personWork?.[indexPerson])} className="flex-grow text-xl h-full rounded-[15px] hover:bg-gray-100 transition delay-50">
                                {month.personWork?.[indexPerson].occupancyId !== null ? month.personWork?.[indexPerson].totalWorkPm : "N/A"}
                            </button>
                        </div>
                    ))}
                    {emptyColumnsCount > 0 &&
                        Array.from({ length: emptyColumnsCount }).map((_, index) => (
                            <div key={`empty-person-${indexPerson}-${index}`} />
                        ))
                    }
                </React.Fragment>
            ))}

            <div className="flex h-14 uppercase text-sm items-center">
                Total work
            </div>

            {shownMonths.map((month, index) => (
                <div key={`total-work-${index}`} className="flex h-14 text-xl justify-center border-solid items-center">
                    {month.actualTotalWorkPm}
                </div>
            ))}

            {emptyColumnsCount > 0 &&
                Array.from({ length: emptyColumnsCount }).map((_, index) => (
                    <div key={`empty-total-work-${index}`} />
                ))
            }

            <div className="flex h-14 uppercase text-sm items-center">
                Total spending
            </div>

            {shownMonths.map((month, index) => (
                <div key={`total-spending-${index}`} className="flex h-14 justify-center text-xl border-solid items-center">
                    {month.actualMonthSpending}
                </div>
            ))}

            {open && (
                <WorkloadModal
                    closeModal={() => setOpen(false)}
                    modalWidth="700px"
                    monthDate={selectedMonth ?? ""}
                    person={selectedPerson}
                    handleEdit={handleEdit}
                />
            )}
        </div>
    );
};

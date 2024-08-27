import {WorkloadTableProps} from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import {useEffect, useMemo, useState} from "react";
import {WorkloadModal} from "./WorkloadModal";
import {PersonDto, PersonOnProjectDto, PersonWorkDto} from "../../../../temp_ts";
import {GoTriangleRight} from "react-icons/go";
import {IoMdInformationCircleOutline} from "react-icons/io";
import * as React from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useParams} from "react-router-dom";
import {useRequestArgs} from "../../../util/CustomHooks";

export const WorkloadTable = ({statistics, currentPage, monthsPerPage, handleEdit}: WorkloadTableProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedPerson, setSelectedPerson] = useState<{ workPerson: PersonWorkDto | undefined, person: PersonDto }>();
    const [projectPeople, setProjectPeople] = useState<Array<PersonOnProjectDto>>();
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();

    useEffect(() => {
        if (projectId) {
            const getPeopleOnProject = async () => {
                const response = await projectAPI.getPeopleOnProjectByProjectId(
                    projectId,
                    await requestArgs.getRequestArgs()
                );
                if (response.status === 200) {
                    setProjectPeople(response.data.people);
                }
            }
            getPeopleOnProject();
        }
    }, [])
    const {shownMonths, emptyColumnsCount, years} = useMemo(() => {
        if (!statistics.units)
            return {shownMonths: [], startIndex: 0, emptyColumnsCount: 0, years: []};

        const startIndex = (currentPage - 1) * monthsPerPage;
        const shownMonths = statistics.units.slice(startIndex, startIndex + monthsPerPage);
        const emptyColumnsCount = monthsPerPage - shownMonths.length;
        const years = TextUtil.yearColumnLimit(shownMonths, 2);

        return {shownMonths, emptyColumnsCount, years};
    }, [statistics.units, currentPage, monthsPerPage]);
    const handleButtonOpen = (month: string | undefined, workPerson: PersonWorkDto | undefined, person: PersonDto, isAvailable: boolean) => {
        if (month !== undefined && isAvailable) {
            setOpen(true);
            setSelectedMonth(month);
            setSelectedPerson({
                workPerson: workPerson,
                person: person
            });
        }
    }

    return (
        <div className="relative">
            <div
                className="absolute w-full grid divide-x-[1px]"
                style={{
                    gridTemplateColumns: `repeat(${monthsPerPage + 1}, minmax(0, 1fr))`,
                }}
            >
                <div
                    className="p-2 z-0 h-14 border-solid border-gray-200"
                    key={`background-border-first`}
                />
                {Array.from(shownMonths).map((month, index) => (
                    <div
                        className={`p-2 z-0 h-14 border-solid border-gray-200 ${TextUtil.isCurrentMonthYear(month) && "bg-gray-100"}`}
                        key={`background-border-${index}`}
                    />
                ))}
            </div>
            <div
                className="relative grid divide-x-[1px] divide-y-[1px]"
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
                            className={`${index % 2 === 0 ? "bg-c-blue" : "bg-c-sky"} flex mx-2 z-5 text-xl bg-opacity-50 rounded-lg items-center justify-center flex-grow h-full`}
                        >
                            <div className="bg-white mx-5 z-5 text-sm text-center rounded-lg px-2 font-medium">
                                {year.name}
                            </div>
                        </div>
                    </div>
                ))}

                {emptyColumnsCount > 0 &&
                    Array.from({length: emptyColumnsCount}).map((_, index) => (
                        <div key={`empty-year-${index}`}/>
                    ))
                }

                <div className="col-start-1 col-span-1 border-solid border-l-white border-y-gray-200"/>

                {shownMonths.map(month => {
                    return (
                        <div
                            key={month.unitNumber}
                            className={`h-14 relative justify-center flex border-solid border-gray-200 items-center ${TextUtil.isCurrentMonthYear(month) && "bg-gray-100"}`}
                        >
                            <div className={`flex`}>
                                <div className="relative h-full flex items-center">
                                    <div
                                        className="text-xs absolute font-semibold w-20 flex justify-center left-[-45px] transform rotate-[270deg]">
                                        M{month.unitNumber}
                                    </div>
                                    <div className="uppercase text-3xl mx-2">
                                        {TextUtil.getMonthAbbreviation(month?.startDate)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {emptyColumnsCount > 0 &&
                    Array.from({length: emptyColumnsCount}).map((_, index) => (
                        <div key={`empty-month-${index}`}/>
                    ))
                }
                <div className="col-start-1 col-span-1 border-solid border-l-white border-y-gray-200"/>
                {shownMonths.map(month => {
                    return (
                        <div
                            key={month.unitNumber}
                            className={`h-14 relative justify-center space-x-1 flex border-solid border-gray-200 items-center ${TextUtil.isCurrentMonthYear(month) && "bg-gray-100"}`}
                        >
                            <div className="text-xl font-semibold">
                                {TextUtil.roundDownToTwoDecimalPlaces(month.pmBurnDownRate ?? 0)}
                            </div>
                            <div className="text-xs font-semibold">
                                PM
                            </div>
                        </div>
                    )
                })}
                {emptyColumnsCount > 0 &&
                    Array.from({length: emptyColumnsCount}).map((_, index) => (
                        <div key={`empty-burndown-${index}`}/>
                    ))
                }
                <div
                    className="flex h-14 uppercase text-sm font-bold items-center border-solid border-l-white border-y-gray-200">
                    <IoMdInformationCircleOutline className="mr-1"/>
                    budget estimate
                </div>
                {shownMonths.map(month => {
                    return (
                        <div
                            key={month.unitNumber}
                            className={`h-14 relative justify-center flex border-solid border-gray-200 items-center ${TextUtil.isCurrentMonthYear(month) && "bg-gray-100"}`}
                        >
                            <div className="text-xl font-semibold">
                                {month.staffBudgetBurnDownRate ?? 0}
                            </div>
                            <div className="text-xl font-semibold">
                                €
                            </div>
                        </div>
                    )
                })}
                {emptyColumnsCount > 0 &&
                    Array.from({length: emptyColumnsCount}).map((_, index) => (
                        <div key={`empty-burndown-${index}`}/>
                    ))
                }
                {
                    projectPeople && projectPeople.map((person, personIndex) => {
                        return (
                            <React.Fragment key={personIndex}>
                                <div className={`h-20 flex items-center border-solid border-t-gray-200 border-l-white`}>
                                    {
                                        (person?.name && person.lastname) ?
                                            <div>
                                                {TextUtil.truncateString(person?.name + " " + person.lastname, 74)}
                                            </div>
                                            :
                                            <div>
                                                {TextUtil.truncateString(person?.email, 74)}
                                            </div>
                                    }
                                </div>
                                {
                                    shownMonths.map((unit, unitIndex) => {
                                        let unitPersonArray: Array<PersonWorkDto> = [];
                                        const isAvailable = TextUtil.returnPersonAvailabilityByUnit(person, unit);
                                        if (unit.personWork && unit.personWork.length > 0) {
                                            unitPersonArray = unit.personWork.filter(work => work.personId === person.id);
                                        }
                                        return (
                                            <div
                                                key={unitIndex}
                                                className={`flex h-20 items-center justify-center border-solid border-gray-200 ${TextUtil.isCurrentMonthYear(unit) && "bg-gray-100"}`}>
                                                <button
                                                    onClick={() => handleButtonOpen(unit.startDate, unitPersonArray[0], person, isAvailable)}
                                                    className={`${!isAvailable && "cursor-not-allowed"} flex-grow text-xl h-full hover:bg-gray-50 transition delay-50`}>
                                                    {!isAvailable ? "/" : unitPersonArray.length === 0 ? 0 : unitPersonArray[0].totalWorkPm}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                                {emptyColumnsCount > 0 &&
                                    Array.from({length: emptyColumnsCount}).map((_, index) => (
                                        <div key={`empty-person-${personIndex}-${index}`}/>
                                    ))
                                }
                            </React.Fragment>
                        )
                    })
                }
                <div
                    className="flex h-14 uppercase font-bold text-sm items-center border-solid border-l-white border-y-gray-200">
                    <GoTriangleRight className="mr-1"/>
                    Total work
                </div>

                {shownMonths.map((month, index) => (
                        <div
                            key={`total-work-${index}`}
                            className={`flex h-14 space-x-1 text-xl font-semibold justify-center border-solid border-gray-200 items-center ${TextUtil.getWorkStatusColors(month)}`}>

                            <div>
                                {TextUtil.roundDownToTwoDecimalPlaces(month.actualTotalWorkPm ?? 0)}
                            </div>
                            <div className="text-xs font-semibold">
                                PM
                            </div>
                        </div>
                    )
                )}

                {emptyColumnsCount > 0 &&
                    Array.from({length: emptyColumnsCount}).map((_, index) => (
                        <div key={`empty-total-work-${index}`}/>
                    ))
                }

                <div
                    className="flex h-14 uppercase text-sm font-bold items-center border-solid border-l-white border-y-gray-200">
                    <GoTriangleRight className="mr-1"/>
                    Total spending
                </div>

                {shownMonths.map((month, index) => (
                    <div
                        key={`total-spending-${index}`}
                        className={`h-14 relative justify-center flex border-solid border-gray-200 items-center ${TextUtil.getSpendingStatusColors(month)}`}>
                        <div className="text-xl font-semibold">
                            {TextUtil.roundDownToTwoDecimalPlaces(month.actualMonthSpending ?? 0)}
                        </div>
                        <div className="text-xl font-semibold">
                            €
                        </div>
                    </div>
                ))}

                {open && selectedPerson && (
                    <WorkloadModal
                        closeModal={() => setOpen(false)}
                        modalWidth="700px"
                        monthDate={selectedMonth ?? ""}
                        person={selectedPerson}
                        handleEdit={handleEdit}
                    />
                )}
            </div>
        </div>
    );
};

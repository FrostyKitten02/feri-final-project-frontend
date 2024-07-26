import {HiCalendar} from "react-icons/hi";
import TextUtil from "../../../util/TextUtil";
import {DonutChart, ProgressBar} from "@tremor/react";
import {Label} from "flowbite-react";
import {DonutGraphData, ProjectDetailsProps} from "../../../interfaces";

export const ProjectDetails = ({project, chosenSchema}: ProjectDetailsProps) => {
    const graphArray: DonutGraphData[] = [
        {
            name: "Staff",
            value: project.staffBudget ?? 0
        },
        {
            name: "Equipment",
            value: project.equipmentBudget ?? 0
        },
        {
            name: "Indirect",
            value: project.indirectBudget ?? 0
        },
        {
            name: "Subcontracting",
            value: project.subcontractingBudget ?? 0
        }
    ]
    const valueFormatter = (number: number) =>
        `${Intl.NumberFormat('eu').format(number).toString()}€`;
    return (
        <div className="relative p-5">
            <div
                className="border-[1px] rounded-[20px] pt-5 px-5 border-solid border-gray-200 h-full w-[450px]">
                <div className="flex flex-row pb-2 items-center">
                    <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                        <HiCalendar className="h-4 w-4 fill-primary"/>
                    </div>
                    <div className="pl-2 text-xs text-muted">
                        {TextUtil.refactorDate(project?.startDate)}
                    </div>
                    <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                    <div className="pr-2 text-xs text-muted">
                        {TextUtil.refactorDate(project?.endDate)}
                    </div>
                    <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                        <HiCalendar className="h-4 w-4 fill-primary"/>
                    </div>
                </div>
                <div className="uppercase text-end text-2xl pb-2 font-medium tracking-wider">
                                <span>
                                    {project?.title}
                                </span>
                </div>
                <ProgressBar
                    value={TextUtil.returnProgress(project?.startDate, project?.endDate)}
                    color="blue"
                    label={`${Math.floor(TextUtil.returnProgress(project?.startDate, project?.endDate)).toString()}%`}
                    showAnimation={true}
                    className="py-2"
                />
                <div className="flex flex-row items-center py-2">
                    <div className="w-[7%] h-[1px] bg-gray-300"/>
                    <Label className="px-2 uppercase text-muted">
                        budget
                    </Label>
                    <div className="flex-grow h-[1px] bg-gray-300"/>
                </div>
                <div className="items-end justify-between flex space-x-2">
                    <div className="flex space-x-1 items-center">
                        <span className="uppercase text-xs">
                            indirect budget:
                        </span>
                        <span className="text-xl font-medium">
                            {TextUtil.numberToPercantage(chosenSchema?.indirectBudget)}
                        </span>
                    </div>
                    <div className="flex space-x-1 items-center">
                        <span className="uppercase text-xs">
                            sofinancing:
                        </span>
                        <span className="text-xl font-medium">
                            {TextUtil.numberToPercantage(chosenSchema?.sofinancing)}
                        </span>
                    </div>
                    <span className="uppercase font-medium text-xl">
                                 {chosenSchema?.name}
                                </span>
                </div>
                <div className="flex justify-between pt-4 pb-5">
                    <div className="uppercase justify-center flex flex-col space-y-1 tracking-wider">
                        <div className="flex space-x-1 items-center">
                                        <span className="uppercase text-xs">
                                           staff:
                                        </span>
                            <span className="text-xl font-medium">
                                            {TextUtil.numberFormatter(project?.staffBudget)}
                                        </span>
                        </div>
                        <div className="flex space-x-1 items-center">
                                        <span className="uppercase text-xs">
                                           equipment:
                                        </span>
                            <span className="text-xl font-medium">
                                            {TextUtil.numberFormatter(project?.equipmentBudget)}
                                        </span>
                        </div>
                        <div className="flex space-x-1 items-center">
                                        <span className="uppercase text-xs">
                                           indirect:
                                        </span>
                            <span className="text-xl font-medium">
                                            {TextUtil.numberFormatter(project?.indirectBudget)}
                                        </span>
                        </div>
                        <div className="flex space-x-1 items-center">
                                        <span className="uppercase text-xs">
                                           subcontracting:
                                        </span>
                            <span className="text-xl font-medium">
                                             {TextUtil.numberFormatter(project?.subcontractingBudget)}
                                        </span>
                        </div>
                    </div>
                    <div className="flex w-[40%] justify-end">
                        <DonutChart
                            data={graphArray}
                            variant="donut"
                            valueFormatter={valueFormatter}
                        />
                    </div>
                </div>
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                project details
            </div>
            {
                /*
               <button
                className="absolute bg-red-50 top-2 right-0">
                edit
            </button>
                 */
            }
        </div>
    )
}
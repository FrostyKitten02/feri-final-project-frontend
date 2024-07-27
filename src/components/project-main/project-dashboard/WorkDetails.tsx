import {DonutGraphData, WorkDetailsLineChartProps, WorkDetailsProps} from "../../../interfaces";
import {DonutChart, LineChart, ProgressBar} from "@tremor/react";
import ChartUtil from "../../../util/ChartUtil";
export const WorkDetails = ({project, statistics}: WorkDetailsProps) => {
    const graphData: DonutGraphData[] = project.workPackages
        ? project.workPackages.map(workpackage => ({
            name: workpackage.title ?? "",
            value: workpackage.assignedPM ?? 0
        }))
        : [];
    const taskArray: number[] = project.workPackages ? project.workPackages.map(workpackage => {
        return (workpackage.tasks?.length ?? 0)
    }) : [];
    const totalTasks = taskArray.reduce((sum, current) => sum + current, 0);
    const {totalPm, actualPm, pmPercentValue, tooltipValue} = ChartUtil.getWorkDetailsLineChartPm(statistics);
    const valueFormatter = (number: number) => `${number}PM`;
    const lineChartData: WorkDetailsLineChartProps [] = ChartUtil.returnLineChartData(statistics.months);

    // THIS IS TEMPORARY SO THE ERROR DOES NOT SHOW
    // RECHART XAXIS ERROR -> FIX ON ALPHA VERSION -> TREMOR DOES NOT UPDATE ON ALFA VERSIONS
    // WAITING FOR TREMOR FIX
    const error = console.error;
    console.error = (...args: any) => {
        if (/defaultProps/.test(args[0])) return;
        error(...args);
    };

    return (
        <div className="relative flex-grow p-5">
            <div className="flex flex-col border-solid border-[1px] border-gray-200 rounded-[20px] h-full p-5">
                {
                    project.workPackages ?
                        <>
                            <div className="flex flex-col h-full">
                                <div className="flex">
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex-grow flex flex-col justify-center">
                                            <div className="flex space-x-1 items-center">
                                                <div className="uppercase text-xs">
                                                    work package count:
                                                </div>
                                                <div className="text-xl font-medium">
                                                    {project.workPackages.length}
                                                </div>
                                            </div>
                                            <div className="flex space-x-1 items-center">
                                                <div className="uppercase text-xs">
                                                    task count:
                                                </div>
                                                <div className="text-xl font-medium">
                                                    {totalTasks}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="py-1">
                                                <div className="text-xs uppercase text-muted">
                                                    Done {actualPm}PM out of {totalPm}PM - {pmPercentValue}%
                                                </div>
                                            </div>
                                            <ProgressBar
                                                value={pmPercentValue}
                                                color="blue"
                                                showAnimation={true}
                                                tooltip={tooltipValue}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex w-[40%] justify-end">
                                        <DonutChart
                                            data={graphData}
                                            valueFormatter={valueFormatter}
                                        />
                                    </div>
                                </div>
                                <div className="flex-grow flex items-end">
                                    <LineChart
                                        className="h-44"
                                        data={lineChartData}
                                        categories={["pmPerMonth"]}
                                        index="date"
                                        color="teal"
                                    />
                                </div>
                            </div>
                        </> :
                        <div className="flex-grow text-muted flex items-center justify-center">
                            There is currently no data to display.
                        </div>
                }
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                work details
            </div>
        </div>
    )
}
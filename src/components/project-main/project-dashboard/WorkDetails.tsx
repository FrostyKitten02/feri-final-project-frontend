import {DonutGraphData, WorkDetailsLineChartProps, WorkDetailsProps} from "../../../interfaces";
import {DonutChart, LineChart, ProgressBar} from "@tremor/react";
import ChartUtil from "../../../util/ChartUtil";
import {useEffect, useState} from "react";
export const WorkDetails = ({project, statistics}: WorkDetailsProps) => {
    const [graphData, setGraphData] = useState<DonutGraphData[]>([]);
    const [totalTasks, setTotalTasks] = useState<number>(0);
    const [lineChartData, setLineChartData] = useState<WorkDetailsLineChartProps[]>([]);
    const [chartDetails, setChartDetails] = useState<{totalPm: number, actualPm: number, pmPercentValue: number, tooltipValue: string | undefined}>({
        totalPm: 0,
        actualPm: 0,
        pmPercentValue: 0,
        tooltipValue: undefined
    });
    const valueFormatter = (number: number) => `${number}PM`;
    useEffect(() => {
        if (project && project.workPackages) {
            const newGraphData = project.workPackages.map(workpackage => ({
                name: workpackage.title ?? "",
                value: workpackage.assignedPM ?? 0
            }));
            setGraphData(newGraphData);
            const taskArray = project.workPackages.map(workpackage => workpackage.tasks?.length ?? 0);
            const totalTasks = taskArray.reduce((sum, current) => sum + current, 0);
            setTotalTasks(totalTasks);
        }
    }, [project]);

    useEffect(() => {
        if (statistics) {
            const { totalPm, actualPm, pmPercentValue, tooltipValue } = ChartUtil.getWorkDetailsLineChartPm(statistics);
            setChartDetails({ totalPm, actualPm, pmPercentValue, tooltipValue });
            const newLineChartData = ChartUtil.returnLineChartData(statistics.months);
            setLineChartData(newLineChartData);
        }
    }, [statistics]);

    // THIS IS TEMPORARY SO THE ERROR DOES NOT SHOW
    // RECHART XAXIS ERROR -> FIX ON ALPHA VERSION -> TREMOR DOES NOT UPDATE ON ALFA VERSIONS
    // WAITING FOR TREMOR FIX
    useEffect(() => {
        const error = console.error;
        console.error = (...args: any) => {
            if (/defaultProps/.test(args[0])) return;
            error(...args);
        };
    }, []);

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
                                                    Done {chartDetails.actualPm}PM out of {chartDetails.totalPm}PM - {chartDetails.pmPercentValue}%
                                                </div>
                                            </div>
                                            <ProgressBar
                                                value={chartDetails.pmPercentValue}
                                                color="blue"
                                                showAnimation={true}
                                                tooltip={chartDetails.tooltipValue}
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
                                        categories={["PM per month"]}
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
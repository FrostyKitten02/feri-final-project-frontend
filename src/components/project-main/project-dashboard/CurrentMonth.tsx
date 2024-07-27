import {Label} from "flowbite-react";
import {BarChart} from "@tremor/react";
import {CurrentMonthProps} from "../../../interfaces";
import ChartUtil from "../../../util/ChartUtil";
import TextUtil from "../../../util/TextUtil";
import {Fragment, useEffect, useState} from "react";
import {ProjectMonthDto, TaskDto} from "../../../../temp_ts";
import { BsDot } from "react-icons/bs";

export const CurrentMonth = ({statistics}: CurrentMonthProps) => {
    const [chartData, setChartData] = useState<Array<{ "name": string, "Assigned PM": number, "Actual PM": number }>>([]);
    const [barColor, setBarColor] = useState<Array<string>>([]);
    const [foundMonth, setFoundMonth] = useState<ProjectMonthDto | undefined>(undefined);
    const [currDate, setCurrDate] = useState<string>('');
    const [relevantTasks, setRelevantTasks] = useState<Array<TaskDto>>([]);

    // THIS IS TEMPORARY SO THE ERROR DOES NOT SHOW
    // RECHART XAXIS ERROR -> FIX ON ALPHA VERSION -> TREMOR DOES NOT UPDATE ON ALFA VERSIONS
    // WAITING FOR TREMOR FIX
    const error = console.error;
    console.error = (...args: any) => {
        if (/defaultProps/.test(args[0])) return;
        error(...args);
    };
    useEffect(() => {
        const {chartData, barColor, foundMonth} = ChartUtil.returnCurrentMonthBarChartData(statistics);
        setChartData(chartData);
        setBarColor(barColor);
        setFoundMonth(foundMonth);
        const currentDate = TextUtil.getMonthYearCurrentDate();
        setCurrDate(currentDate);
        const tasks = TextUtil.getRelevantTasks(statistics.workPackages);
        setRelevantTasks(tasks);
    }, [statistics]);
    return (
        <div className="flex flex-col flex-grow space-y-3">
            <div className="flex flex-row items-center">
                <div className="w-[7%] h-[1px] bg-gray-300"/>
                <Label className="px-2 uppercase text-muted">
                    current month
                </Label>
                <div className="flex-grow h-[1px] bg-gray-300"/>
            </div>
            {
                statistics.workPackages?.length !== 0 ?
                    <Fragment>
                        {
                            foundMonth !== undefined ?
                                <Fragment>
                                    <div className="text-xl font-medium text-end">
                                        {currDate}
                                    </div>
                                    <BarChart
                                        data={chartData}
                                        className="pr-8 h-[350px]"
                                        categories={["Assigned PM", "Actual PM"]}
                                        index="name"
                                        colors={barColor}
                                    />
                                    <div className="flex flex-row items-center">
                                        <div className="w-[7%] h-[1px] bg-gray-300"/>
                                        <Label className="px-2 uppercase text-muted">
                                            ongoing tasks
                                        </Label>
                                        <div className="flex-grow h-[1px] bg-gray-300"/>
                                    </div>
                                    <div className="overflow-y-auto h-[400px]">
                                        {
                                            relevantTasks.map((task, index) => {
                                                return (
                                                    <div key={index} className="flex items-center">
                                                        <BsDot />
                                                        <div className="font-medium">
                                                            {task.title}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Fragment> :
                                <div className="text-muted flex items-center justify-center flex-grow">
                                    There is not data for current month.
                                </div>
                        }
                    </Fragment> :
                    <div className="text-muted flex items-center justify-center flex-grow">
                        There is currently no data to display.
                    </div>
            }
        </div>
    )
}
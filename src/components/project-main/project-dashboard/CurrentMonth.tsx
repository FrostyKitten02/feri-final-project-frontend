import {Label} from "flowbite-react";
import {BarChart} from "@tremor/react";
import {CurrentMonthProps} from "../../../interfaces";
import ChartUtil from "../../../util/ChartUtil";
import TextUtil from "../../../util/TextUtil";
import {Fragment, useEffect, useState} from "react";
import {ProjectMonthDto, TaskDto} from "../../../../temp_ts";
import { BsDot } from "react-icons/bs";
import { ProjectModal } from "../../app-main/projects/ProjectModal";
import { useParams } from "react-router-dom";
import { DeleteProjectModal } from "../../app-main/projects/DeleteProjectModal";

export const CurrentMonth = ({statistics, handleEditProject}: CurrentMonthProps) => {
    const [chartData, setChartData] = useState<Array<{ "name": string, "Assigned PM": number, "Actual PM": number }>>([]);
    const [barColor, setBarColor] = useState<Array<string>>([]);
    const [foundMonth, setFoundMonth] = useState<ProjectMonthDto | undefined>(undefined);
    const [currDate, setCurrDate] = useState<string>('');
    const [relevantTasks, setRelevantTasks] = useState<Array<TaskDto>>([]);
    const {projectId} = useParams();

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

    useEffect(() => {
        // THIS IS TEMPORARY SO THE ERROR DOES NOT SHOW
        // RECHART XAXIS ERROR -> FIX ON ALPHA VERSION -> TREMOR DOES NOT UPDATE ON ALPFA VERSIONS
        // WAITING FOR TREMOR FIX
        const error = console.error;
        console.error = (...args: any) => {
            if (/defaultProps/.test(args[0])) return;
            error(...args);
        };
    }, []);

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
                                    <div className="overflow-y-auto flex flex-col flex-grow h-[290px]">
                                        {
                                            relevantTasks.map((task, index) => {
                                                return (
                                                    <div key={index} className="flex">
                                                        <div className="pt-[5px]">
                                                            <BsDot />
                                                        </div>
                                                        <div className="font-medium">
                                                            {task.title}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center">
                                            <div className="w-[7%] h-[1px] bg-gray-300"/>
                                            <Label className="px-2 uppercase text-muted">
                                                manage project
                                            </Label>
                                            <div className="flex-grow h-[1px] bg-gray-300"/>
                                        </div>
                                        <div className="flex flex-col justify-center h-[100px]">
                                            <ProjectModal edit={true} popoverEdit={true} projectId={projectId} handleProjectSubmit={handleEditProject}/>
                                            <DeleteProjectModal />
                                        </div>
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
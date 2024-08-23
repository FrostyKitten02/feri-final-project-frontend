import {HiCalendar} from "react-icons/hi";
import TextUtil from "../../../util/TextUtil";
import {BarChart, ProgressBar} from "@tremor/react";
import {Label, Spinner} from "flowbite-react";
import {ActiveProjectsChartProps, ProjectSectionItemProps} from "../../../interfaces";
import {useEffect, useState} from "react";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI} from "../../../util/ApiDeclarations";
import ChartUtil from "../../../util/ChartUtil";
import SessionUtil from "../../../util/SessionUtil";
import {useNavigate} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";

export const ProjectSectionItem = ({project}: ProjectSectionItemProps) => {
    const [barChartData, setBarChartData] = useState<ActiveProjectsChartProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const {user} = useUser();
    const requestArgs = useRequestArgs();
    const navigate = useNavigate();

    useEffect(() => {
        // THIS IS TEMPORARY SO THE ERROR DOES NOT SHOW
        // RECHART XAXIS ERROR -> FIX ON ALPHA VERSION -> TREMOR DOES NOT UPDATE ON ALPHA VERSIONS
        // WAITING FOR TREMOR FIX
        const error = console.error;
        console.error = (...args: any) => {
            if (/defaultProps/.test(args[0])) return;
            error(...args);
        };
    }, []);

    useEffect(() => {
        const getStatistics = async (): Promise<void> => {
            try {
                if (!project.id)
                    return;
                const response = await projectAPI.getProjectStatistics(
                    project.id,
                    requestArgs
                )
                if (response.status === 200) {
                    const chartData = {
                        projectId: project.id,
                        stateData: ChartUtil.getActiveProjectsBarChartData(response.data)
                    }
                    setBarChartData(chartData);
                }
                setLoading(false);
            } catch (error: any) {
            }
        }
        if(project.ownerId === user?.id){
            getStatistics();
        } else {
            setLoading(false);
        }
    }, [project]);
    const pmValueFormatter = (value: number) => {
        return value + ' PM';
    };
    const budgetValueFormatter = (value: number) => {
        return value + ' €';
    };
    const handleNavigate = () => {
        if(project.ownerId === user?.id){
            navigate(`/project/${project?.id}/project-dashboard`);
            SessionUtil.setSidebarSelect("project dashboard");
        }
    };
    return (
        loading ?
            <div className="flex justify-center items-center h-full w-full">
                <Spinner size="xl"/>
            </div> :
            <button
                onClick={handleNavigate}
                className={`${project.ownerId === user?.id ? "hover:bg-gray-100 transition delay-50" : "cursor-default"} w-1/2 rounded-[20px]`}>
                <div
                    className="h-full border-solid border-[1px] rounded-[20px] border-gray-200 pt-5 px-5 space-y-5 flex flex-col">
                    <div className="flex flex-row items-center">
                        <div
                            className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                            <HiCalendar className="h-4 w-4 fill-primary"/>
                        </div>
                        <div className="pl-2 text-xs text-muted">
                            {TextUtil.refactorDate(project.startDate)}
                        </div>
                        <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                        <div className="pr-2 text-xs text-muted">
                            {TextUtil.refactorDate(project.endDate)}
                        </div>
                        <div
                            className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                            <HiCalendar className="h-4 w-4 fill-primary"/>
                        </div>
                    </div>
                    <div className="text-3xl font-semibold text-center py-3">
                        {project.title}
                    </div>
                    <div>
                        <ProgressBar
                            value={TextUtil.returnProgress(project?.startDate, project?.endDate)}
                            color="blue"
                            showAnimation={true}
                            className="py-2"
                        />
                        <div className="text-muted uppercase text-sm">
                            {`Progress: ${Math.floor(TextUtil.returnProgress(project?.startDate, project?.endDate)).toString()}%`}
                        </div>
                    </div>
                    {project.ownerId === user?.id ?
                    <div className="flex-grow">
                        <div className="space-y-2 h-1/2 flex flex-col">
                            <div className="flex flex-row items-center">
                                <div className="w-[7%] h-[1px] bg-gray-300"/>
                                <Label className="px-2 uppercase text-muted">
                                    pm report
                                </Label>
                                <div className="flex-grow h-[1px] bg-gray-300"/>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                                {
                                    barChartData &&
                                    (barChartData.stateData.dataPm[0]["Available"] !== 0 || barChartData.stateData.dataPm[1]["Available"] !== 0) ?
                                        <BarChart
                                            data={barChartData.stateData.dataPm}
                                            categories={["Used", "Available"]}
                                            index="name"
                                            colors={['rose', 'blue']}
                                            yAxisWidth={0}
                                            className="h-full max-h-[250px] w-[350px]"
                                            valueFormatter={pmValueFormatter}
                                        /> :
                                        <div className="flex items-center justify-center text-center h-full text-muted">
                                            There are no available PM for current year and month.
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="pace-y-2 h-1/2 flex flex-col">
                            <div className="flex flex-row items-center">
                                <div className="w-[7%] h-[1px] bg-gray-300"/>
                                <Label className="px-2 uppercase text-muted">
                                    budget report
                                </Label>
                                <div className="flex-grow h-[1px] bg-gray-300"/>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                                {
                                    barChartData &&
                                    (barChartData.stateData.dataBudget[0]["Available"] !== 0 || barChartData.stateData.dataBudget[1]["Available"] !== 0) ?
                                        <BarChart
                                            data={barChartData.stateData.dataBudget}
                                            categories={["Used", "Available"]}
                                            index="name"
                                            colors={['rose', 'violet']}
                                            yAxisWidth={0}
                                            className="h-full max-h-[250px] w-[350px]"
                                            valueFormatter={budgetValueFormatter}
                                        /> :
                                        <div className="flex items-center justify-center text-center h-full text-muted">
                                            There is no available budget for current year and month.
                                        </div>
                                }
                            </div>
                        </div>
                    </div> :
                    <div className="space-y-4 h-full">
                        <div className="flex flex-row items-center pt-2">
                            <div className="w-[7%] h-[1px] bg-gray-300"/>
                            <Label className="px-2 uppercase text-muted">
                                collaboration duration
                            </Label>
                            <div className="flex-grow h-[1px] bg-gray-300"/>
                        </div>
                        <div className="flex flex-col items-center font-semibold">
                            <div className="text-2xl">
                                {TextUtil.refactorDate(project.startDate)} spremeni
                            </div>
                            <div>
                                -
                            </div>
                            <div className="text-2xl">
                                {TextUtil.refactorDate(project.endDate)} spremeni
                            </div>
                        </div>
                        <div className="flex flex-row items-center pt-2">
                            <div className="w-[7%] h-[1px] bg-gray-300"/>
                            <Label className="px-2 uppercase text-muted">
                                occupancy
                            </Label>
                            <div className="flex-grow h-[1px] bg-gray-300"/>
                        </div>
                        <div className="text-2xl font-semibold">
                            5% spremeni
                        </div>
                    </div>
                    }
                </div>
            </button>
    )
}
import {useNavigate} from "react-router-dom";
import TextUtil from "../../../util/TextUtil";
import SessionUtil from "../../../util/SessionUtil";
import {HiCalendar} from "react-icons/hi";
import {FC, useEffect, useState} from "react";
import {ActiveProjectsChartProps, ProjectItemProps} from "../../../interfaces";
import {useUser} from "@clerk/clerk-react";
import {BarChart, ProgressBar} from "@tremor/react";
import {Label, Spinner} from "flowbite-react";
import ChartUtil from "../../../util/ChartUtil";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {LuPackage} from "react-icons/lu";
import {IoPeopleOutline} from "react-icons/io5";

export const ProjectItem: FC<ProjectItemProps> = ({project}) => {
    const navigate = useNavigate();
    const {user} = useUser();
    const requestArgs = useRequestArgs();
    const [barChartData, setBarChartData] = useState<ActiveProjectsChartProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const progress: number = TextUtil.returnProgress(project?.startDate, project?.endDate);
    const {text, color, bgColor} = TextUtil.returnProgressText(progress);
    useEffect(() => {
        if (project) {
            const getStatistics = async (): Promise<void> => {
                try {
                    if (!project.id)
                        return;
                    const response = await projectAPI.getProjectStatistics(
                        project.id,
                        undefined,
                        undefined,
                        await requestArgs.getRequestArgs()
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
            if (project.ownerId === user?.id) {
                getStatistics();
            } else {
                setLoading(false);
            }
        }
    }, [project]);

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

    const pmValueFormatter = (value: number) => {
        return value + ' PM';
    };
    const handleNavigate = () => {
        if (project?.ownerId === user?.id) {
            navigate(`/project/${project?.id}/project-dashboard`);
            SessionUtil.setSidebarSelect("dashboard");
        }
    };

    return (
        project && (
            <div className="p-5">
                <div className={`flex flex-col w-full h-full border border-gray-200 border-solid rounded-xl`}>
                    <button
                        className={`${project.ownerId === user?.id ? "hover:bg-gray-100 transition delay-50" : "cursor-default"} p-5 flex flex-grow rounded-xl`}
                        onClick={() => handleNavigate()}
                    >
                        <div className="flex flex-col flex-grow h-full">
                            <div className="flex flex-row items-center">
                                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                    <HiCalendar className="h-4 w-4 fill-primary"/>
                                </div>
                                <div className="pl-2 text-xs text-muted">
                                    {TextUtil.refactorDate(project.startDate)}
                                </div>
                                <div className="flex-grow mx-2 h-[1px] bg-gray-200"/>
                                <div className="pr-2 text-xs text-muted">
                                    {TextUtil.refactorDate(project.endDate)}
                                </div>
                                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-200">
                                    <HiCalendar className="h-4 w-4 fill-primary"/>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-center py-6">
                                {TextUtil.truncateString(project.title, 70)}
                            </div>
                            <div>
                                <ProgressBar
                                    value={progress}
                                    color={color}
                                    showAnimation={true}
                                    className="py-2"
                                />
                                <div className="text-muted text-start uppercase text-sm pb-4">
                                    <div className="flex items-center">
                                        <div className={`${bgColor} rounded-full w-2 h-2 mr-2`}/>
                                        <div className="text-sm uppercase tracking-wider">
                                            {`${text}: ${Math.floor(TextUtil.returnProgress(project?.startDate, project?.endDate)).toString()}%`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {loading ?
                                <div className="flex justify-center items-center h-full w-full">
                                    <Spinner size="xl"/>
                                </div> :
                                <>
                                    {project.ownerId === user?.id ?
                                        <div className="flex flex-col h-full">
                                            <div className="flex flex-row items-center pt-2">
                                                <div className="w-[7%] h-[1px] bg-gray-300"/>
                                                <Label className="px-2 uppercase text-muted">
                                                    project details
                                                </Label>
                                                <div className="flex-grow h-[1px] bg-gray-300"/>
                                            </div>
                                            <div className="flex justify-evenly py-4">
                                                <div className="flex space-x-2 flex-row items-center">
                                                    <LuPackage size="22"/>
                                                    <div className="text-lg">
                                                        {project.workPackageCount}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 flex-row items-center">
                                                    <IoPeopleOutline size="22"/>
                                                    <div className="text-lg">
                                                        {project.peopleCount}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex flex-col flex-grow">
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
                                                            <div
                                                                className="flex items-center justify-center text-center h-full text-muted">
                                                                There are no available PM for current year and month.
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div> :
                                        <div>
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
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </button>
                </div>
            </div>
        )
    );
};
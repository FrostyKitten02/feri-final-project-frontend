import {DonutChart} from "@tremor/react";
import {UserDetailsChartData, UserDetailsProjectData} from "../../../interfaces";
import {useUser} from "@clerk/clerk-react";
import {Label, Spinner} from "flowbite-react";
import {useEffect, useState} from "react";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI} from "../../../util/ApiDeclarations";
import ChartUtil from "../../../util/ChartUtil";
import RequestUtil from "../../../util/RequestUtil";


export const UserDetails = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [projectsStatus, setProjectsStatus] = useState<Array<UserDetailsChartData>>([]);
    const [projectData, setProjectData] = useState<UserDetailsProjectData>()
    const requestArgs = useRequestArgs();
    const {user} = useUser();

    useEffect(() => {
        const getStatuses = async () => {
            try {
                const response = await projectAPI.listProjectsStatus(await requestArgs.getRequestArgs());
                if (response.status === 200) {
                    const statuses = ChartUtil.returnUserDetailsChartData(response.data);
                    setProjectsStatus(statuses);
                    const numOfProjects = Object.values(statuses).reduce((sum, value) => sum + value.value, 0);
                    const numOfActiveProjects = Object.values(statuses).filter(value => {
                        if (value.name === "Ongoing projects")
                            return value.value
                    })
                    if(numOfActiveProjects.length === 0){
                        setProjectData({
                            all: numOfProjects ?? 0,
                            active: 0
                        })
                    } else {
                        setProjectData({
                            all: numOfProjects ?? 0,
                            active: numOfActiveProjects[0].value ?? 0
                        })
                    }
                }
                setLoading(false);
            } catch (error) {
                RequestUtil.handleAxiosRequestError(error);
            }
        }
        getStatuses();
    }, [])
    return (
        <div className="relative p-5 z-0">
            <div
                className="border-gray-200 w-[450px] space-y-6 flex flex-col h-full rounded-[20px] p-5 border-solid border-[1px]">
                <div className="relative h-[70px]">
                    <div className="relative flex z-20 items-end h-full justify-end space-x-2">
                        <div className="text-lg">
                            Hi,
                        </div>
                        <div className="text-3xl flex font-semibold">
                            {user?.fullName ? user.fullName : user?.primaryEmailAddress + ""}
                            <div className="font-normal">
                                !
                            </div>
                        </div>
                    </div>
                    {
                        user?.fullName &&
                        <div className="text-right text-sm text-muted">
                            {user?.primaryEmailAddress + ""}
                        </div>
                    }
                </div>
                <div className="flex flex-row items-center py-2">
                    <div className="w-[7%] h-[1px] bg-gray-300"/>
                    <Label className="px-2 uppercase text-muted">
                        projects
                    </Label>
                    <div className="flex-grow h-[1px] bg-gray-300"/>
                </div>
                {
                    loading ?
                        <div className="flex justify-center items-center h-full w-full">
                            <Spinner size="xl"/>
                        </div> :
                        <>
                            {
                                projectData?.all !== 0 ?
                                    <>
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="text-lg">
                                                Number of projects you've already been a part of:
                                            </div>
                                            <div className="text-4xl font-semibold">
                                                {projectData?.all}
                                            </div>
                                        </div>
                                        <div>
                                            <DonutChart
                                                data={projectsStatus}
                                                variant="pie"
                                                className="h-[170px]"
                                                colors={["rose", "amber", "green"]}
                                            />
                                        </div>
                                    </> :
                                    <div className="h-[150px] text-muted flex justify-center items-center">
                                        You haven't been a part of a project yet.
                                    </div>
                            }
                            {
                                projectData?.active ?
                                    <>
                                        <div className="flex flex-col h-full items-center justify-center space-y-2">
                                            <div className="text-lg">
                                                Number of projects you're currently working on:
                                            </div>
                                            <div className="text-4xl font-semibold">
                                                {projectData.active}
                                            </div>
                                        </div>
                                    </> :
                                    <div className="flex-grow h-[150px] flex items-center justify-center text-muted">
                                        You currently aren't working on any projects.
                                    </div>
                            }
                        </>
                }
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                user details
            </div>
        </div>
    )
}

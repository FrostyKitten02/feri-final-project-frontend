import {Spinner} from "flowbite-react";
import {useEffect, useState} from "react";
import {UserDetails} from "./UserDetails";
import {UserDetailsChartData} from "../../../interfaces";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI} from "../../../util/ApiDeclarations";
import ChartUtil from "../../../util/ChartUtil";
export const DashboardPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [projectsStatus, setProjectsStatus] = useState<Array<UserDetailsChartData>>([]);
    const requestArgs = useRequestArgs();
    useEffect(() => {
        const getStatuses = async () => {
            try{
                const response = await projectAPI.listProjectsStatus(requestArgs);
                if(response.status === 200) {
                    setProjectsStatus(ChartUtil.returnUserDetailsChartData(response.data));
                    setLoading(false);
                }
            } catch (error){

            }
        }
        getStatuses();
    }, [])
    return (
        <div className="flex flex-grow">
            {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                    <Spinner size="xl"/>
                </div>
            ) : (
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex flex-grow">
                        <UserDetails projectsStatus={projectsStatus}/>
                        <div className="relative p-5 z-0 flex-grow">
                            <div
                                className="border-gray-200 flex items-center h-full rounded-[20px] p-5 border-solid border-[1px]">
                                aktivni projekti - in progress, pokazala se posta dva - dodaj pagination
                            </div>
                            <div
                                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                                active projects
                            </div>
                        </div>
                    </div>
                    {
                        /*
                        <div>
                        <div className="relative p-5 z-0">
                            <div
                                className="border-gray-200 flex h-[350px] items-center w-full rounded-[20px] p-5 border-solid border-[1px]">
                                tasks + deadlines
                            </div>
                            <div
                                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                                Deadlines
                            </div>
                        </div>
                    </div>
                         */
                    }
                </div>
            )}
        </div>
    )
}
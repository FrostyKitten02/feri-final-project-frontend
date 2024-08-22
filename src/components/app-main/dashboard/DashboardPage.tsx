import {Spinner} from "flowbite-react";
import {useEffect, useState} from "react";
import {UserDetails} from "./UserDetails";
import {UserDetailsChartData} from "../../../interfaces";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI} from "../../../util/ApiDeclarations";
import ChartUtil from "../../../util/ChartUtil";
import {ActiveProjectsSection} from "./ActiveProjectsSection";
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
                        <ActiveProjectsSection />
                    </div>
                </div>
            )}
        </div>
    )
}
import {useState, useEffect} from "react";
import {UserDetails} from "./UserDetails";
import {ActiveProjectsSection} from "./ActiveProjectsSection";
import {UpcomingProject} from "./UpcomingProject";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI} from "../../../util/ApiDeclarations";
import {ProjectModal} from "../projects/ProjectModal";
import RequestUtil from "../../../util/RequestUtil";

export const DashboardPage = () => {
    const [hasProjects, setHasProjects] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const requestArgs = useRequestArgs();

    useEffect(() => {
        checkUserProjects();
    }, []);

    const checkUserProjects = async (): Promise<void> => {
        try {
            const response = await projectAPI.listProjectsStatus(
                await requestArgs.getRequestArgs()
            );
            if (response.status === 200) {
                const totalProjects =
                    (response.data.finishedProjects ?? 0) +
                    (response.data.inProgressProjects ?? 0) +
                    (response.data.scheduledProjects ?? 0);
                setHasProjects(totalProjects > 0);
            }
            setIsLoading(false);
        } catch (error) {
            RequestUtil.handleAxiosRequestError(error);
            setIsLoading(false);
            setHasProjects(true);
        }
    };

    const handleProjectCreated = (): void => {
        setHasProjects(true);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-grow">
            <div className="p-5 flex flex-col flex-grow">
                {!isLoading && !hasProjects && (
                    <div className="pb-5">
                        <div className="relative">
                            <div className="border-[1px] border-solid rounded-[20px] border-primary bg-primary/5 flex items-center justify-between p-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-semibold text-primary">
                                        Create your very first project
                                    </h2>
                                    <p className="text-muted">
                                        Get started by creating a project to track budgets, tasks, and team members
                                    </p>
                                </div>
                                <div>
                                    <ProjectModal
                                        handleProjectSubmit={handleProjectCreated}
                                        callToAction={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div key={refreshKey} className="flex max-[1400px]:flex-col flex-grow">
                    <div className="flex max-[1200px]:flex-col min-[1400px]:flex-col">
                        <UserDetails />
                        <UpcomingProject />
                    </div>
                    <ActiveProjectsSection/>
                </div>
            </div>
        </div>
    )
}
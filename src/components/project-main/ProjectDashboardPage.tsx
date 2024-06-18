import {useEffect, useState} from "react";
import {ProjectStatisticsResponse} from "../../../temp_ts";
import {projectAPI} from "../../util/ApiDeclarations";
import {useRequestArgs} from "../../util/CustomHooks";
import {useParams} from "react-router-dom";
import {OverviewChart, OverviewChartBody, OverviewChartHeader} from "../template/overview-chart/OverviewChart";

export const ProjectDashboardPage = () => {
    const [statistics, setStatistics] = useState<ProjectStatisticsResponse>({workPackages: [], months: []})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [monthsPerPage, setMonthsPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();


    useEffect(() => {
        const getStatistics = async (): Promise<void> => {
            if (!projectId)
                return;
            try {
                const response = await projectAPI.getProjectStatistics(
                    projectId,
                    requestArgs
                )
                if (response.status === 200) {
                    setStatistics(response.data);
                    setIsLoading(false);
                }
            } catch (error: any) {
            }
        }
        getStatistics();
    }, [])
    return (
        <div className="flex flex-col w-full p-5">
            <div>
                PROJECT DASHBOARD
            </div>
            <div>
                {
                    isLoading ? "loading" :
                        <OverviewChart monthsPerPage={monthsPerPage}>
                            <OverviewChartHeader months={statistics.months}
                                                 currentPage={currentPage}
                                                 monthsPerPage={monthsPerPage}
                            />
                            <OverviewChartBody statistics={statistics}
                                               currentPage={currentPage}
                                               monthsPerPage={monthsPerPage}
                            />
                        </OverviewChart>
                }
            </div>
            <div className="flex justify-between p-5">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    prev
                </button>
                <button onClick={() => setMonthsPerPage(6)}>
                    set 6 months
                </button>
                <button onClick={() => setMonthsPerPage(12)}>
                    set 12 months
                </button>
                <button onClick={() => setMonthsPerPage(4)}>
                    set 4 months
                </button>
                <button disabled={currentPage + 1 > (statistics.months?.length ?? monthsPerPage) / monthsPerPage}
                        onClick={() => setCurrentPage(currentPage + 1)}>
                    next
                </button>
            </div>
        </div>
    )
}
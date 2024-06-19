import {useEffect, useState} from "react";
import {ProjectStatisticsResponse} from "../../../temp_ts";
import {projectAPI} from "../../util/ApiDeclarations";
import {useRequestArgs} from "../../util/CustomHooks";
import {useParams} from "react-router-dom";
import {OverviewChart, OverviewChartBody, OverviewChartHeader} from "../template/overview-chart/OverviewChart";
import {CustomPagination} from "../template/pagination/CustomPagination";
export const ProjectDashboardPage = () => {
    const [statistics, setStatistics] = useState<ProjectStatisticsResponse>({workPackages: [], months: []})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [monthsPerPage, setMonthsPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();


    const handleMonthChange = (count: number) => {
        setMonthsPerPage(count);
        setCurrentPage(1);
    }

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
                        <OverviewChart monthsPerPage={monthsPerPage}
                                       workpackageCount={statistics.workPackages?.length ?? 0}>
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
                {
                    /*
                     <div className="flex flex-row">
                        <input type="number"
                               placeholder="12"
                               onChange={handleChange}
                               value={inputValue}
                               className={`rounded-lg w-[80px] bg-gray-50 pr-10 border-gray-300 no-arrows`}
                        />
                    <button onClick={() => setMonthsPerPage(inputValue)}>
                        set shown months
                    </button>
                </div>
                     */
                }
                <div className="flex flex-row space-x-2">
                    <div className="flex pr-1 items-center font-mono uppercase">
                        Shown months:
                    </div>
                    <button
                        className={`${monthsPerPage === 4 ? "bg-blue-200" : "hover:bg-gray-50"} px-3 border-[1px] rounded-lg`}
                        onClick={() => handleMonthChange(4)}
                    >
                        4
                    </button>
                    <button
                        className={`${monthsPerPage === 6 ? "bg-blue-200" : "hover:bg-gray-50"} px-3 border-[1px] rounded-lg`}
                        onClick={() => handleMonthChange(6)}
                    >
                        6
                    </button>
                    <button
                        className={`${monthsPerPage === 12 ? "bg-blue-200" : "hover:bg-gray-50"} px-3 border-[1px] rounded-lg`}
                        onClick={() => handleMonthChange(12)}
                    >
                        12
                    </button>
                </div>

                <CustomPagination totalPages={(statistics.months?.length ?? monthsPerPage) / monthsPerPage}
                                  onPageChange={setCurrentPage} currentPage={currentPage}/>
            </div>
        </div>
    )
}
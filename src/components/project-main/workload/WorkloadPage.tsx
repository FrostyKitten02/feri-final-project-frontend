import {useEffect, useState} from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useParams} from "react-router-dom";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectStatisticsResponse} from "../../../../temp_ts";
import {WorkloadTable} from "./WorkloadTable";
import {CustomPagination} from "../../template/pagination/CustomPagination";

const StatisticsInitialState = {
    workPackages: undefined,
    months: undefined
}

export const WorkloadPage = () => {
    const [statistics, setStatistics] = useState<ProjectStatisticsResponse>(StatisticsInitialState);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [monthsPerPage, setMonthsPerPage] = useState<number>(6);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const requestArgs = useRequestArgs();
    const {projectId} = useParams();

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
    }, [projectId])
    const handleMonthChange = (count: number) => {
        setMonthsPerPage(count);
        setCurrentPage(1);
    }
    return (
        !isLoading &&
        <div className="flex flex-col flex-grow">
                <div className="m-10 flex-grow overflow-y-auto">
                    <div>
                        <WorkloadTable
                            statistics={statistics}
                            currentPage={currentPage}
                            monthsPerPage={monthsPerPage}
                        />
                    </div>
                </div>
            <div>
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
            <CustomPagination
                totalPages={(Math.ceil((statistics.months?.length ?? 0) / monthsPerPage))}
                onPageChange={setCurrentPage} currentPage={currentPage}
                nextLabelText=""
                backLabelText=""
            />
        </div>
    )
}

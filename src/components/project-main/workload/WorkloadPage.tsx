import {useEffect, useState} from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useParams} from "react-router-dom";
import {useRequestArgs} from "../../../util/CustomHooks";
import {ProjectStatisticsResponse} from "../../../../temp_ts";
import {WorkloadTable} from "./WorkloadTable";
import {CustomPagination} from "../../template/pagination/CustomPagination";
import {Spinner} from "flowbite-react";

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

    useEffect(() => {
        getStatistics();
    }, [projectId])

    const handleMonthChange = (count: number) => {
        setMonthsPerPage(count);
        setCurrentPage(1);
    }
    const handleEdit = (): void => {
        getStatistics();
    }
    return (
        <div className="flex flex-col p-10 flex-grow">
            {
                isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner size="xl"/>
                    </div>
                ) : (
                    <div className="relative py-6 flex flex-col h-full border-[1px] border-gray-200 border-solid rounded-[20px]">
                        <div className="mx-5 flex-grow overflow-y-auto">
                                <WorkloadTable
                                    statistics={statistics}
                                    currentPage={currentPage}
                                    monthsPerPage={monthsPerPage}
                                    handleEdit={handleEdit}
                                />
                        </div>
                        <div className="absolute top-[-25px] bg-white rounded-[20px] right-20 flex justify-end p-2 uppercase space-x-4 items-center">
                            <div className="flex space-x-2 font-semibold">
                                <button
                                    className={`${
                                        monthsPerPage === 4
                                            ? "bg-c-sky bg-opacity-10 text-primary"
                                            : "hover:bg-gray-100"
                                    } px-3 delay-50 transition py-1 rounded-lg`}
                                    onClick={() => handleMonthChange(4)}
                                >
                                    4
                                </button>
                                <button
                                    className={`${
                                        monthsPerPage === 6
                                            ? "bg-c-sky bg-opacity-10 text-primary"
                                            : "hover:bg-gray-100"
                                    } px-3 py-1 delay-50 transition rounded-lg`}
                                    onClick={() => handleMonthChange(6)}
                                >
                                    6
                                </button>
                                <button
                                    className={`${
                                        monthsPerPage === 12
                                            ? "bg-c-sky bg-opacity-10 text-primary"
                                            : "hover:bg-gray-100"
                                    } px-3 py-1 delay-50 transition rounded-lg`}
                                    onClick={() => handleMonthChange(12)}
                                >
                                    12
                                </button>
                            </div>
                        </div>
                        <div className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
                            Workload data table
                        </div>
                        <div className="absolute rounded-[20px] text-center text-muted bg-white bottom-[-16px] font-medium right-20 uppercase flex px-2">
                            {(statistics.months?.length ?? 0) > 0 && (
                                <CustomPagination
                                    totalPages={(Math.ceil((statistics.months?.length ?? 0) / monthsPerPage))}
                                    onPageChange={setCurrentPage}
                                    currentPage={currentPage}
                                    nextLabelText=""
                                    backLabelText=""
                                />
                            )}
                        </div>
                    </div>
                )
            }


        </div>
    )
}
{
    /*
    <div className="m-10 flex-grow overflow-y-auto">
        <div>
            <WorkloadTable
                statistics={statistics}
                currentPage={currentPage}
                monthsPerPage={monthsPerPage}
                handleEdit={handleEdit}
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
     */
}
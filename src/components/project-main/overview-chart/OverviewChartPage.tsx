import {useEffect, useState} from "react";
import {ProjectStatisticsResponse} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {useParams} from "react-router-dom";
import {OverviewChart, OverviewChartBody, OverviewChartHeader,} from "../../template/overview-chart/OverviewChart";
import {CustomPagination} from "../../template/pagination/CustomPagination";
import {Spinner} from "flowbite-react";

export const OverviewChartPage = () => {
  const [statistics, setStatistics] = useState<ProjectStatisticsResponse>({
    workPackages: [],
    units: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [monthsPerPage, setMonthsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { projectId } = useParams();
  const requestArgs = useRequestArgs();
  const totalPages = Math.ceil(
    (statistics.units?.length ?? 0) / monthsPerPage
  );
  const handleMonthChange = (count: number) => {
    setMonthsPerPage(count);
    setCurrentPage(1);
  };

  useEffect(() => {
    const getStatistics = async (): Promise<void> => {
      if (!projectId) return;
      try {
        const response = await projectAPI.getProjectStatistics(
          projectId,
          undefined,
          undefined,
            await requestArgs.getRequestArgs()
        );
        if (response.status === 200) {
          const sortedWp = response.data.workPackages?.sort((a, b) => {
            const fallbackDate = new Date(Date.now()).getTime();
            const dateA = a.startDate
              ? new Date(a.startDate).getTime()
              : fallbackDate;
            const dateB = b.startDate
              ? new Date(b.startDate).getTime()
              : fallbackDate;
            return dateA - dateB;
          });
          const sortedStatitics: ProjectStatisticsResponse = {
            workPackages: sortedWp,
            units: response.data.units,
          };
          setStatistics(sortedStatitics);
          setIsLoading(false);
        }
      } catch (error: any) {}
    };
    getStatistics();
  }, []);

  return (
    <div className="w-full h-full p-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="relative py-6 flex flex-col h-full border-[1px] border-gray-200 border-solid rounded-[20px] px-5">
          {(statistics.workPackages?.length ?? 0) > 0 && (
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
          )}
          <div className="flex-grow overflow-y-auto">
            <OverviewChart
              monthsPerPage={monthsPerPage}
              workpackageCount={statistics.workPackages?.length ?? 0}
            >
              <OverviewChartHeader
                months={statistics.units}
                currentPage={currentPage}
                monthsPerPage={monthsPerPage}
              />
              <OverviewChartBody
                statistics={statistics}
                currentPage={currentPage}
                monthsPerPage={monthsPerPage}
              />
            </OverviewChart>
          </div>
          <div className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
            Gantt overview
          </div>
          <div className="absolute rounded-[20px] text-center text-muted bg-white bottom-[-16px] font-medium right-20 uppercase flex px-2">
            {(statistics.workPackages?.length ?? 0) > 0 && (
              <CustomPagination
                totalPages={totalPages}
                backLabelText=""
                nextLabelText=""
                onPageChange={setCurrentPage}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

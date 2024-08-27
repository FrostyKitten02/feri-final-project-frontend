import {AreaChart} from "@tremor/react";
import {useEffect, useState} from "react";
import {CostTimelineChartProps, CostTimelineProps} from "../../../interfaces";
import ChartUtil from "../../../util/ChartUtil";

export const CostTimeline = ({stats}: CostTimelineProps) => {
    const [chartData, setChartData] = useState<Array<CostTimelineChartProps>>([]);
    const valueFormatter = function (number: number) {
        return new Intl.NumberFormat('us').format(number).toString() + '€';
    }

    useEffect(() => {
        if (stats.units !== undefined) {
            const chartData = ChartUtil.getCostTimelineChartData(stats.units);
            setChartData(chartData);
        }

    }, [stats]);

    return (
        <div className="relative p-5 z-0">
            <div
                className="border-gray-200 w-[700px] h-full flex justify-center items-center rounded-[20px] p-5 border-solid border-[1px]">
                {
                    stats.workPackages?.length !== 0 && chartData.length !== 0 ?
                        <AreaChart
                            data={chartData}
                            categories={["Actual cost", "Predicted cost"]}
                            index="date"
                            valueFormatter={valueFormatter}
                            showLegend={false}
                            className="h-[280px]"
                        /> :
                        <div className="h-full flex flex-grow justify-center items-center text-muted">
                            There is currently no data to display.
                        </div>
                }
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                cost timeline
            </div>
        </div>
    )
}
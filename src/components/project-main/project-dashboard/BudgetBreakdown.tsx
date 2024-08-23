import {ProgressCircle, Tracker} from "@tremor/react";
import {Label} from "flowbite-react";
import {BudgetBreakdownChartProps, BudgetBreakdownProps, BudgetBreakdownTrackerData} from "../../../interfaces";
import {useMemo, useState} from "react";
import TextUtil from "../../../util/TextUtil";
import ChartUtil from "../../../util/ChartUtil";

export const BudgetBreakdown = ({statistics}: BudgetBreakdownProps) => {
    const [spentBudget, setSpentBudget] = useState<BudgetBreakdownChartProps>({
        usedBudget: 0,
        totalBudget: 0,
        percentage: 0
    });
    const [chartData, setChartData] = useState<Array<BudgetBreakdownTrackerData>>([]);
    useMemo(() => {
        const {usedBudget, totalBudget, percentage} = TextUtil.getSpentBudgetProps(statistics);
        setSpentBudget({usedBudget, totalBudget, percentage});
        const data = ChartUtil.getBudgetBreakdownTrackerData(statistics);
        setChartData(data);
    }, [statistics])
    return (
        <div className="relative p-5 flex-grow">
            <div
                className="p-5 flex flex-col border-solid space-y-5 border-[1px] rounded-[20px] border-gray-200 h-full">
                {
                    statistics?.workPackages && statistics.workPackages.length !== 0 ?
                        <>
                            <div className="flex space-x-5 pt-2">
                                <ProgressCircle
                                    value={spentBudget.percentage}
                                    radius={60}
                                    strokeWidth={13}
                                    color="indigo"
                                >
                                    <div>
                                        {spentBudget.percentage + "%"}
                                    </div>
                                </ProgressCircle>
                                <div className="flex flex-col justify-center">
                                    <div className="text-xl font-medium">
                                        {TextUtil.numberFormatter(spentBudget.usedBudget) + " / " + TextUtil.numberFormatter(spentBudget.totalBudget) + " (" + spentBudget.percentage + "%)"}
                                    </div>
                                    <div className="text-muted uppercase text-xs">
                                        Used all time staff budget
                                    </div>
                                </div>
                            </div>
                            <div className="flex pt-5 flex-row items-center">
                                <div className="w-[7%] h-[1px] bg-gray-300"/>
                                <Label className="px-2 uppercase text-muted">
                                    BUDGET ESTIMATE TRACKER
                                </Label>
                                <div className="flex-grow h-[1px] bg-gray-300"/>
                            </div>
                            <div className="mx-5 flex-grow">
                                <Tracker data={chartData} className={"h-full"}/>
                            </div>
                        </> :
                        <div className="h-full flex flex-grow justify-center items-center text-muted">
                            There is currently no data to display.
                        </div>
                }
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                budget breakdown
            </div>
        </div>
    )
}
import {BarChart} from "@tremor/react";
import {CurrentlyRelevantCurrDate, CurrentlyRelevantData, CurrentMonthProps} from "../../../interfaces";
import ChartUtil from "../../../util/ChartUtil";
import TextUtil from "../../../util/TextUtil";
import {Fragment, useEffect, useState} from "react";

export const CurrentlyRelevant = ({statistics}: CurrentMonthProps) => {
    const [monthData, setMonthData] = useState<CurrentlyRelevantData>();
    const [yearData, setYearData] = useState<CurrentlyRelevantData>();
    const [currDate, setCurrDate] = useState<CurrentlyRelevantCurrDate>({year: "", month: ""});

    useEffect(() => {
        const mData = ChartUtil.returnCurrentMonthBarChartData(statistics);
        setMonthData(mData);
        const yData = ChartUtil.returnCurrentYearBarChartData(statistics);
        setYearData(yData);
        const currentDate = TextUtil.getMonthYearCurrentDate();
        setCurrDate(currentDate);
    }, [statistics]);

    useEffect(() => {
        // THIS IS TEMPORARY SO THE ERROR DOES NOT SHOW
        // RECHART XAXIS ERROR -> FIX ON ALPHA VERSION -> TREMOR DOES NOT UPDATE ON ALPHA VERSIONS
        // WAITING FOR TREMOR FIX
        const error = console.error;
        console.error = (...args: any) => {
            if (/defaultProps/.test(args[0])) return;
            error(...args);
        };
    }, []);

    const valueFormatter = (value: number) => {
        return value + ' PM';
    };

    return (
        <div className="flex flex-col flex-grow h-full justify-around">
            {
                statistics.workPackages?.length !== 0 && (
                    <Fragment>
                        {yearData !== undefined ? (
                            <div className="space-y-2">
                                <div>
                                    <div className="text-xs text-end uppercase text-muted">
                                        Actual vs. Planned PM for current year
                                    </div>
                                    <div className="text-xl font-medium text-end">
                                        {currDate.year}
                                    </div>
                                </div>
                                <BarChart
                                    data={yearData.chartData}
                                    className="pr-8"
                                    categories={["Assigned", "Actual"]}
                                    index="name"
                                    colors={yearData.barColor}
                                    showLegend={false}
                                    valueFormatter={valueFormatter}
                                />
                            </div>
                        ) : (
                            <div className="text-muted flex items-center justify-center flex-grow">
                                There is no data for the current year.
                            </div>
                        )}
                    </Fragment>
                )
            }
            {
                statistics.workPackages?.length !== 0 ? (
                    <Fragment>
                        {monthData?.foundMonth !== undefined ? (
                            <div className="space-y-2">
                                <div>
                                    <div className="text-xs text-end uppercase text-muted">
                                        Actual vs. Planned PM for current Month
                                    </div>
                                    <div className="text-xl font-medium text-end">
                                        {currDate.month}
                                    </div>
                                </div>
                                <BarChart
                                    data={monthData.chartData}
                                    className="pr-8"
                                    categories={["Assigned", "Actual"]}
                                    index="name"
                                    colors={monthData.barColor}
                                    showLegend={false}
                                    valueFormatter={valueFormatter}
                                />
                            </div>
                        ) : (
                            <div className="text-muted flex items-center justify-center flex-grow">
                                There is no data for the current month.
                            </div>
                        )}
                    </Fragment>
                ) : (
                    <div className="text-muted flex items-center justify-center flex-grow">
                        There is currently no data to display.
                    </div>
                )}
        </div>
    );
};

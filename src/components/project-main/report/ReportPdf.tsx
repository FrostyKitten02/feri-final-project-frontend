import TextUtil from "../../../util/TextUtil";
import {Fragment} from "react";
import {BarChart} from "@tremor/react";
import {ReportPdfProps} from "../../../interfaces";

export const ReportPdf = ({reportType, chosenMonthly, barChartData}: ReportPdfProps) => {
    const pmValueFormatter = (value: number) => {
        return value + ' PM';
    };
    const budgetValueFormatter = (value: number) => {
        return value + '€';
    };

    return (
        <>
            <div id="report-div" className="flex flex-col h-full p-5">
                <div className="text-xs uppercase italic">
                    {"Created  on: " + TextUtil.refactorDate(new Date().toString())}
                </div>
                <div
                    className="uppercase text-3xl font-bold text-center pb-14 pt-10">
                    {reportType} Report
                </div>
                <div>
                    {
                        chosenMonthly &&
                        <>
                            <div className="grid grid-cols-3">
                                <div
                                    className="text-start uppercase font-semibold">
                                    Full name
                                </div>
                                <div
                                    className="text-center uppercase font-semibold">
                                    Personal months
                                </div>
                                <div
                                    className="text-center uppercase font-semibold">
                                    Salary
                                </div>
                                <div
                                    className="col-span-3 bg-black w-full h-[1px] mt-2"/>
                                {
                                    chosenMonthly.map((month, monthIndex) => (
                                        <Fragment key={monthIndex}>
                                            {
                                                month.personWork?.map((person, index) => {
                                                    return (
                                                        <Fragment
                                                            key={`person-index-${index}-${monthIndex}`}>
                                                            <div
                                                                className={`text-start ${index % 2 === 0 && "bg-gray-200"} pb-3`}>
                                                                {person.personId}
                                                            </div>
                                                            <div
                                                                className={`text-center ${index % 2 === 0 && "bg-gray-200"} pb-3`}>
                                                                {TextUtil.roundDownToTwoDecimalPlaces(person.totalWorkPm ?? 0)}
                                                            </div>
                                                            <div
                                                                className={`text-center ${index % 2 === 0 && "bg-gray-200"} pb-3`}>
                                                                {TextUtil.roundDownToTwoDecimalPlaces((person.totalWorkPm ?? 0) * (person.avgSalary ?? 0)) + "€"}
                                                            </div>
                                                        </Fragment>

                                                    )
                                                })
                                            }
                                            <div
                                                className="col-span-3 bg-black w-full h-[1px]"/>
                                            <div className="uppercase">
                                                Estimated:
                                            </div>
                                            <div
                                                className="uppercase text-center ">
                                                {TextUtil.roundDownToTwoDecimalPlaces(month.pmBurnDownRate ?? 0)}
                                            </div>
                                            <div
                                                className="uppercase text-center">
                                                {TextUtil.roundDownToTwoDecimalPlaces(month.staffBudgetBurnDownRate ?? 0) + "€"}
                                            </div>
                                            <div
                                                className="uppercase font-bold">
                                                Together:
                                            </div>
                                            <div
                                                className="uppercase font-bold text-center">
                                                {TextUtil.roundDownToTwoDecimalPlaces(month.actualTotalWorkPm ?? 0)}
                                            </div>
                                            <div
                                                className="uppercase font-bold text-center">
                                                {TextUtil.roundDownToTwoDecimalPlaces(month.actualMonthSpending ?? 0) + "€"}
                                            </div>
                                            <div className="col-span-3 py-3 italic font-semibold">
                                                {TextUtil.refactorDate(month.startDate)}
                                            </div>
                                            <div className="col-span-3 h-10">
                                            </div>
                                        </Fragment>
                                    ))
                                }
                            </div>
                            {barChartData &&
                                <div className="flex justify-evenly pt-20">
                                    <div className="flex space-x-4">
                                        <div>
                                            <div className="flex items-center">
                                                <div
                                                    className="h-2 rounded-full w-2 bg-c-teal mr-2"/>
                                                <div className="pb-4">
                                                    Estimated PM
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div
                                                    className="h-2 rounded-full w-2 bg-c-blue mr-2"/>
                                                <div className="pb-4">
                                                    Actual PM
                                                </div>
                                            </div>
                                        </div>
                                        <BarChart
                                            data={[barChartData.pmData]}
                                            categories={["Estimated", "Actual"]}
                                            colors={["teal", "blue"]}
                                            index="name"
                                            className="w-[300px]"
                                            showLegend={false}
                                            showTooltip={false}
                                            valueFormatter={pmValueFormatter}
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <BarChart
                                            data={[barChartData.budgetData]}
                                            categories={["Estimated", "Actual"]}
                                            colors={["cyan", "violet"]}
                                            index="name"
                                            className="w-[300px]"
                                            showLegend={false}
                                            showTooltip={false}
                                            valueFormatter={budgetValueFormatter}
                                        />
                                        <div>
                                            <div className="flex items-center">
                                                <div
                                                    className="h-2 rounded-full w-2 bg-c-cyan mr-2"/>
                                                <div className="pb-4">
                                                    Estimated Budget
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div
                                                    className="h-2 rounded-full w-2 bg-c-violet mr-2"/>
                                                <div className="pb-4">
                                                    Actual Budget
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}
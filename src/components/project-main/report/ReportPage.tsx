import {useParams} from "react-router-dom";
import {Fragment, useEffect, useState} from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {ProjectMonthDto} from "../../../../temp_ts";
import {useRequestArgs} from "../../../util/CustomHooks";
import {CSelect, SelectOption} from "../../template/inputs/CustomInputs";
import {SelectedItemProps} from "../../template/inputs/inputsInterface";
import TextUtil from "../../../util/TextUtil";
import {Label, Spinner} from "flowbite-react";
import {ReportPageChartData} from "../../../interfaces";
import ChartUtil from "../../../util/ChartUtil";
import {BarChart} from "@tremor/react";
import html2canvas from "html2canvas";
import {jsPDF} from 'jspdf';

export const ReportPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [months, setMonths] = useState<Array<ProjectMonthDto>>();
    const [selectedMonthly, setSelectedMonthly] = useState<SelectedItemProps>({value: "", text: ""});
    const [chosenMonthly, setChosenMonthly] = useState<Array<ProjectMonthDto>>();
    const [reportType, setReportType] = useState<string>("");
    const [barChartData, setBarChartData] = useState<ReportPageChartData>();
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();
    useEffect(() => {
        const getStatistics = async (): Promise<void> => {
            if (!projectId) return;
            try {
                const response = await projectAPI.getProjectStatistics(
                    projectId,
                    requestArgs
                );
                if (response.status === 200) {
                    setMonths(response.data.months);
                    setLoading(false);
                }
            } catch (error: any) {
            }
        };
        getStatistics();
    }, []);

    useEffect(() => {
            if (selectedMonthly.value !== "" && months) {
                let chosen: Array<ProjectMonthDto> = []
                const selectedIndex = months.findIndex(month => month.date === selectedMonthly.value);
                if (reportType === "quarterly") {
                    chosen = months.slice(selectedIndex, selectedIndex + 3);
                } else if (reportType === "monthly") {
                    chosen = chosen = [months[selectedIndex]];
                }
                setChosenMonthly(chosen);
                const chartData = ChartUtil.getReportChartData(chosen);
                setBarChartData(chartData);
            }
        }
        , [selectedMonthly])
    const generateReport = () => {
        const input = document.getElementById("report-div");
        if (input) {
            html2canvas(input, {scale: 2}).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const padding = 10;
                const imgWidth = pdfWidth - (2 * padding);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', padding, padding, imgWidth, imgHeight);
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
            });
        } else {
            console.error("Element with ID 'report-demo' not found");
        }
    }
    const handleButton = (name: string) => {
        setChosenMonthly(undefined);
        setSelectedMonthly({value: "", text: ""});
        setReportType(name);
    }
    const pmValueFormatter = (value: number) => {
        return value + ' PM';
    };
    const budgetValueFormatter = (value: number) => {
        return value + '€';
    };

    return (
        <div className="flex-grow">
            <div className="h-full p-10">
                <div
                    className={`relative h-full flex flex-col flex-grow border-[1px] border-gray-200 border-solid rounded-[20px] p-5`}>
                    {
                        loading ?
                            <div className="flex h-full flex-col justify-center items-center font-bold text-3xl">
                                <Spinner size="xl"/>
                            </div> :
                            <div className="flex h-full">
                                <div className="w-[450px]">
                                    <div className="text-xl font-semibold text-center">
                                        What kind of report would you like to create?
                                    </div>
                                    <div className="flex justify-evenly py-8">
                                        <button
                                            className={`${reportType === "monthly" ? "bg-c-blue bg-opacity-20" : "hover:bg-gray-100"} text-lg rounded-lg py-2 px-4`}
                                            onClick={() => handleButton("monthly")}>
                                            Monthly
                                        </button>
                                        <button
                                            className={`${reportType === "quarterly" ? "bg-c-blue bg-opacity-20" : "hover:bg-gray-100"} text-lg rounded-lg py-2 px-4`}
                                            onClick={() => handleButton("quarterly")}>
                                            Quarterly
                                        </button>
                                    </div>
                                    {
                                        reportType === "monthly" ?
                                            <div>
                                                <Label>
                                                    Choose month:
                                                </Label>
                                                <CSelect selected={selectedMonthly} setSelected={setSelectedMonthly}>
                                                    {
                                                        months?.map((month, index) => {
                                                            if (month.date) {
                                                                return (
                                                                    <SelectOption key={index} value={month.date ?? ""}>
                                                                        {TextUtil.returnMonthYear(month.date)}
                                                                    </SelectOption>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </CSelect>
                                                {
                                                    selectedMonthly.value !== "" &&
                                                    <div className="flex space-y-4 flex-col">
                                                        <div className="pt-4 text-muted">
                                                            This report will compare the assigned or estimated workload
                                                            and
                                                            budget both by individual employee and in total.
                                                        </div>
                                                        <div className="text-xs text-muted">
                                                            Report preview design is tailored to the export of pdf.
                                                        </div>
                                                        <button
                                                            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg uppercase"
                                                            onClick={() => generateReport()}>
                                                            create a report
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                            : reportType === "quarterly" &&
                                            <div>
                                                <Label>
                                                    Choose month:
                                                </Label>
                                                <CSelect selected={selectedMonthly} setSelected={setSelectedMonthly}>
                                                    {
                                                        (months && months.length > 2 ? months.slice(0, -2) : months)?.map((month, index) => {
                                                            if (month.date) {
                                                                return (
                                                                    <SelectOption key={index} value={month.date ?? ""}>
                                                                        {TextUtil.returnMonthYear(month.date)}
                                                                    </SelectOption>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </CSelect>
                                                <div className="text-muted text-xs">
                                                    Chosen and following two months will be shown in report.
                                                </div>
                                                {
                                                    selectedMonthly.value !== "" &&
                                                    <div className="flex space-y-4 flex-col">
                                                        <div className="pt-4 text-muted">
                                                            This report will compare the assigned or estimated workload
                                                            and
                                                            budget both by individual employee and in total.
                                                        </div>
                                                        <div className="text-xs text-muted">
                                                            Report preview design is tailored to the export of pdf.
                                                        </div>
                                                        <button
                                                            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg uppercase"
                                                            onClick={() => generateReport()}>
                                                            create a report
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                    }
                                </div>
                                <div className="bg-gray-200 w-[1px] mx-5 h-full"/>
                                {
                                    selectedMonthly.value !== "" ?
                                        <div id="report-div" className="flex flex-col h-full overflow-y-auto p-5">
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
                                                                chosenMonthly.map(month => (
                                                                    <>
                                                                        {
                                                                            month.personWork?.map((person, index) => {
                                                                                return (
                                                                                    <Fragment
                                                                                        key={`person-index-${index}`}>
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
                                                                            {TextUtil.refactorDate(month.date)}
                                                                        </div>
                                                                        <div className="col-span-3 h-10">
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                        {barChartData && reportType === "monthly" &&
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
                                        </div> :
                                        <div className="flex-grow flex items-center justify-center text-muted">
                                            Choose months to preview report.
                                        </div>
                                }
                            </div>
                    }
                    <div
                        className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
                        report
                    </div>
                </div>
            </div>
        </div>
    )
}
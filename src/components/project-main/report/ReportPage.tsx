import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {CSelect, SelectOption} from "../../template/inputs/CustomInputs";
import {SelectedItemProps} from "../../template/inputs/inputsInterface";
import TextUtil from "../../../util/TextUtil";
import {Label, Spinner} from "flowbite-react";
import {ReportPageChartData} from "../../../interfaces";
import ChartUtil from "../../../util/ChartUtil";
import html2canvas from "html2canvas";
import {jsPDF} from 'jspdf';
import {ProjectStatisticsUnitDto} from "../../../../temp_ts";
import {ReportPdf} from "./ReportPdf";
import {
    CustomModal,
    CustomModalBody,
    CustomModalFooter,
    CustomModalHeader,
    ModalTitle
} from "../../template/modal/CustomModal";

export const ReportPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [months, setMonths] = useState<Array<ProjectStatisticsUnitDto>>();
    const [selectedMonthly, setSelectedMonthly] = useState<SelectedItemProps>({value: "", text: ""});
    const [chosenMonthly, setChosenMonthly] = useState<Array<ProjectStatisticsUnitDto>>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
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
                    undefined,
                    undefined,
                    await requestArgs.getRequestArgs()
                );
                if (response.status === 200) {
                    setMonths(response.data.units);
                    setLoading(false);
                }
            } catch (error: any) {
            }
        };
        getStatistics();
    }, []);

    useEffect(() => {
            if (selectedMonthly.value !== "" && months) {
                let chosen: Array<ProjectStatisticsUnitDto> = []
                const selectedIndex = months.findIndex(unit => unit.startDate === selectedMonthly.value);
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
        , [selectedMonthly]);
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
    const previewReport = () => {
        setModalOpen(true);
    }
    const generateReport = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = document.getElementById("report-div");
        if (input) {
            html2canvas(input, {scrollY: -window.scrollY, height: input.scrollHeight}).then((canvas) => {
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
                                                            if (month.startDate) {
                                                                return (
                                                                    <SelectOption key={index}
                                                                                  value={month.startDate ?? ""}>
                                                                        {TextUtil.returnMonthYear(month.startDate)}
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
                                                            onClick={() => previewReport()}>
                                                            preview report
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
                                                            if (month.startDate) {
                                                                return (
                                                                    <SelectOption key={index}
                                                                                  value={month.startDate ?? ""}>
                                                                        {TextUtil.returnMonthYear(month.startDate)}
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
                                                            onClick={() => previewReport()}>
                                                            preview report
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                    }
                                </div>
                                <div className="bg-gray-200 w-[1px] mx-5 h-full"/>
                                <div className="overflow-y-auto">
                                    {
                                        selectedMonthly.value !== "" &&
                                        <ReportPdf
                                            reportType={reportType}
                                            barChartData={barChartData}
                                            chosenMonthly={chosenMonthly}/>
                                    }
                                </div>
                            </div>
                    }
                    <div
                        className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
                        report
                    </div>
                </div>
            </div>
            {
                modalOpen &&
                <CustomModal
                    closeModal={() => setModalOpen(false)}
                    modalWidth="1100px"
                >
                    <CustomModalHeader handleModalClose={() => setModalOpen(false)}>
                        <ModalTitle>
                            preview report
                        </ModalTitle>
                    </CustomModalHeader>
                    <CustomModalBody>
                        <ReportPdf
                            reportType={reportType}
                            chosenMonthly={chosenMonthly}
                            barChartData={barChartData}
                        />
                    </CustomModalBody>
                    <form onSubmit={generateReport}>
                        <CustomModalFooter>
                            create report
                        </CustomModalFooter>
                    </form>
                </CustomModal>
            }
        </div>
    )
}
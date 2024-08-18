import {
    CustomModal,
    CustomModalBody,
    CustomModalFooter,
    CustomModalHeader,
    ModalText,
    ModalTitle,
} from "../../template/modal/CustomModal";
import {WorkloadModalProps} from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {TextInput} from "flowbite-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {WorkloadFormFields} from "../../../types/types";
import {
    CreateOccupancyRequest, ListSalaryResponse,
    UpdateOccupancyRequest,
} from "../../../../temp_ts";
import {occupancyAPI, salaryApi} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {toastError} from "../../toast-modals/ToastFunctions";

export const WorkloadModal = ({
                                  closeModal,
                                  modalWidth,
                                  monthDate,
                                  person,
                                  handleEdit,
                                  personal
                              }: WorkloadModalProps) => {
    const {projectId} = useParams();
    const {register, reset, handleSubmit} = useForm<WorkloadFormFields>();
    const [salary, setSalary] = useState<ListSalaryResponse>();
    const {monthName, year} = useMemo(() => {
        const date = TextUtil.getFirstOfYearMonth(monthDate);
        const monthName = date.toLocaleString("default", {month: "long"});
        const year = date.getFullYear();
        return {monthName, year};
    }, [monthDate]);
    const requestArgs = useRequestArgs();

    const handleFormSubmit = (): void => {
        reset();
        closeModal();
        handleEdit();
    };
    useEffect(() => {
        const getSalaray = async (): Promise<void> => {
            const date = new Date().toISOString().split('T')[0];
            console.log("opened")
            try{
                const response = await salaryApi.listSalaries(
                    {
                        elementsPerPage: 1,
                        pageNumber: 1
                    },
                    {
                        ascending: true,
                        fields: [
                            "START_DATE"
                        ]
                    },
                    {
                        forUser: person.personId,
                        startDateFrom: date,
                        startDateTo: date,
                        endDateFrom: date,
                        endDateTo: date
                    },
                    useRequestArgs()
                )
                if (response.status === 200) {
                    setSalary(response.data)
                    console.log(salary?.salaries)
                    console.log("correct")
                }
                else {
                    console.log("error")
                }
            } catch (error){

            }
        }
        getSalaray();
    }, [])

    const onSubmit: SubmitHandler<WorkloadFormFields> = async (
        data
    ): Promise<void> => {
        try {
            if (person.occupancyId === null) {
                const workload: CreateOccupancyRequest = {
                    projectId: projectId,
                    personId: person.personId,
                    toMonth: monthDate,
                    fromMonth: monthDate,
                    value: data.pmValue,
                };
                const response = await occupancyAPI.addOccupancy(workload, requestArgs);
                if (response.status === 201) {
                    handleFormSubmit();
                }
            } else if (data.pmValue == 0 && person.occupancyId !== undefined) {
                const response = await occupancyAPI.deleteOccupancy(
                    person.occupancyId,
                    requestArgs
                );
                if (response.status === 200) {
                    handleFormSubmit();
                }
            } else {
                const workload: UpdateOccupancyRequest = {
                    occupancyId: person.occupancyId,
                    value: data.pmValue,
                };
                const response = await occupancyAPI.updateOccupancy(
                    workload,
                    requestArgs
                );
                if (response.status === 200) {
                    handleFormSubmit();
                }
            }
        } catch (error: any) {
            toastError(error.message);
        }
    };
    return (
        <CustomModal closeModal={closeModal} modalWidth={modalWidth}>
            <CustomModalHeader handleModalClose={closeModal}>
                <ModalTitle>Edit workload</ModalTitle>
                <ModalText
                    showIcon={true}
                    contentColor="muted"
                >
                    Information provided in the form can be changed later on.
                    <div className="flex items-center text-black text-md space-x-[5px]">
                        <div>You are curently editing workload of</div>
                        {
                            (personal?.name && personal.lastname) ?
                                <>
                                    <div className="font-semibold">
                                        {personal?.name}
                                    </div>
                                    <div className="font-semibold">
                                        {personal?.lastname}
                                    </div>
                                </> :
                                <div className="font-semibold">
                                    {personal?.email}
                                </div>
                        }
                        <div>for</div>
                        <div className="font-semibold">
                            {monthName + ","}
                        </div>
                        <div className="font-semibold">
                            {year + "."}
                        </div>
                    </div>
                </ModalText>
            </CustomModalHeader>{" "}
            <form onSubmit={handleSubmit(onSubmit)}>
                <CustomModalBody>
                    <div>
                        <div className="flex items-center space-x-2">
                            <div>PM:</div>
                            <TextInput
                                type="number"
                                className="w-[200px]"
                                min={0}
                                step="0.01"
                                defaultValue={person.totalWorkPm}
                                {...register("pmValue")}
                            />
                        </div>
                    </div>
                </CustomModalBody>
                <CustomModalFooter>edit</CustomModalFooter>
            </form>
        </CustomModal>
    );
};

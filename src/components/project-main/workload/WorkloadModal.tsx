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
import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {TextInput} from "flowbite-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {WorkloadFormFields} from "../../../types/types";
import {CreateOccupancyRequest, UpdateOccupancyRequest,} from "../../../../temp_ts";
import {occupancyAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {toastError} from "../../toast-modals/ToastFunctions";

export const WorkloadModal = ({
                                  closeModal,
                                  modalWidth,
                                  monthDate,
                                  person,
                                  handleEdit,
                              }: WorkloadModalProps) => {
    const {projectId} = useParams();
    const {register, reset, handleSubmit} = useForm<WorkloadFormFields>();
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
    const onSubmit: SubmitHandler<WorkloadFormFields> = async (
        data
    ): Promise<void> => {
        try {
            if(person.workPerson === undefined){
                const workload: CreateOccupancyRequest = {
                    projectId: projectId,
                    personId: person.person.id,
                    toMonth: monthDate,
                    fromMonth: monthDate,
                    value: data.pmValue,
                };
                const response = await occupancyAPI.addOccupancy(workload, await requestArgs.getRequestArgs());
                if (response.status === 201) {
                    handleFormSubmit();
                }
            } else {
                if (person.workPerson.occupancyId === null) {
                    const workload: CreateOccupancyRequest = {
                        projectId: projectId,
                        personId: person.workPerson.personId,
                        toMonth: monthDate,
                        fromMonth: monthDate,
                        value: data.pmValue,
                    };
                    const response = await occupancyAPI.addOccupancy(workload, await requestArgs.getRequestArgs());
                    if (response.status === 201) {
                        handleFormSubmit();
                    }
                } else if (data.pmValue == 0 && person.workPerson.occupancyId) {
                    const response = await occupancyAPI.deleteOccupancy(
                        person.workPerson.occupancyId,
                        await requestArgs.getRequestArgs()
                    );
                    if (response.status === 200) {
                        handleFormSubmit();
                    }
                }
                else {
                    const workload: UpdateOccupancyRequest = {
                        occupancyId: person.workPerson.occupancyId,
                        value: data.pmValue,
                    };
                    const response = await occupancyAPI.updateOccupancy(
                        workload,
                        await requestArgs.getRequestArgs()
                    );
                    if (response.status === 200) {
                        handleFormSubmit();
                    }
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
                        <div>You are currently editing workload of</div>
                        {
                            (person.person.name && person.person.lastname) ?
                                <>
                                    <div className="font-semibold">
                                        {person.person.name}
                                    </div>
                                    <div className="font-semibold">
                                        {person.person.lastname}
                                    </div>
                                </> :
                                <div className="font-semibold">
                                    {person.person.email}
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
                    <div className="space-y-3">
                        <div className="flex space-x-2">
                            <div>
                                This month's remaining availability:
                            </div>
                            <div>
                                [availability]
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div>Assign personal months:</div>
                            <TextInput
                                type="number"
                                className="w-[200px]"
                                min={0}
                                step="0.01"
                                defaultValue={person.workPerson?.totalWorkPm}
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

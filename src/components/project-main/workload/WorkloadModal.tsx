import {
    CustomModal,
    CustomModalBody,
    CustomModalFooter,
    CustomModalHeader, ModalText,
    ModalTitle
} from "../../template/modal/CustomModal";
import {WorkloadModalProps} from "../../../interfaces";
import TextUtil from "../../../util/TextUtil";
import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {TextInput} from "flowbite-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {WorkloadFormFields} from "../../../types/forms/formTypes";
import {CreateOccupancyRequest, UpdateOccupancyRequest} from "../../../../temp_ts";
import {occupanyAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";

export const WorkloadModal = ({closeModal, modalWidth, monthDate, person}: WorkloadModalProps) => {
    const {projectId} = useParams();
    const {register, reset, handleSubmit} = useForm<WorkloadFormFields>();
    const { monthName, year } = useMemo(() => {
        const date = TextUtil.getFirstOfYearMonth(monthDate);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return { monthName, year };
    }, [monthDate]);
    const requestArgs = useRequestArgs();

    const onSubmit: SubmitHandler<WorkloadFormFields> = async (data): Promise<void> => {
        console.log("here")
        try{
            if(person.occupancyId === null){
                const workload: CreateOccupancyRequest = {
                    projectId: projectId,
                    personId: person.personId,
                    toMonth: monthDate,
                    fromMonth: monthDate,
                    value: data.pmValue
                }
                const response = await occupanyAPI.addOccupancy(workload, requestArgs);
                if (response.status === 200){
                    console.log("success")
                    reset();
                    closeModal();
                }
                else {
                    console.log("unsuccess")
                }
            } else {
                const workload: UpdateOccupancyRequest = {
                    occupancyId: person.occupancyId,
                    value: data.pmValue
                }
                const response = await occupanyAPI.updateOccupancy(workload, requestArgs);
                if (response.status === 200){
                    console.log("success")
                    reset();
                    closeModal();
                }
                else {
                    console.log("unsuccess")
                }
            }

        }
        catch (error: any){}
    }
    return (
        <CustomModal closeModal={closeModal} modalWidth={modalWidth}>
            <CustomModalHeader handleModalOpen={closeModal}>
                <ModalTitle>
                    Edit workload
                </ModalTitle>
                <ModalText showInfoIcon={true} showWarningIcon={false} contentColor="muted">
                    Information provided in the form can be changed later on.
                </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <div>
                        You are currently editing {person.personId}'s workload for {monthName}, {year}.
                    </div>
                    <div className="flex">
                        <div>
                            PM:
                        </div>
                        <TextInput type="number"
                                   min="0"
                                   defaultValue={person.totalWorkPm}
                                   {...register("pmValue")}
                        />
                    </div>
                </div>
                </form>
            </CustomModalBody>
            <CustomModalFooter>
                edit
            </CustomModalFooter>
        </CustomModal>
    )
}
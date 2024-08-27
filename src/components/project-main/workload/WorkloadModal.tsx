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
import {Label, TextInput} from "flowbite-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {WorkloadFormFields} from "../../../types/types";
import {
    CreateOccupancyRequest,
    PersonTypeListDto,
    UpdateOccupancyRequest,
} from "../../../../temp_ts";
import {occupancyAPI, personTypeAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import RequestUtil from "../../../util/RequestUtil";

export const WorkloadModal = ({
                                  closeModal,
                                  modalWidth,
                                  monthDate,
                                  person,
                                  handleEdit,
                              }: WorkloadModalProps) => {
    const {projectId} = useParams();
    const {register, reset, handleSubmit} = useForm<WorkloadFormFields>();
    const requestArgs = useRequestArgs();
    const [personType, setPersonType] = useState<PersonTypeListDto>();
    useEffect(() => {
        const getPersonTypeData = async () => {
            try{
                const response = await personTypeAPI.listPersonTypes(
                    {
                        elementsPerPage: 1,
                        pageNumber: 1
                    },
                    {
                        ascending: true,
                        fields: ["START_DATE"]
                    },
                    {
                        startDateTo: monthDate,
                        forUser: person.person.id
                    },
                    await requestArgs.getRequestArgs()
                )
                if(response.status === 200){
                    if(response.data.personTypes?.length === 1 ){
                        setPersonType(response.data.personTypes[0])
                    }
                }
            } catch (err){}
        }
        getPersonTypeData();
    }, [])

    const {monthName, year} = useMemo(() => {
        const date = TextUtil.getFirstOfYearMonth(monthDate);
        const monthName = date.toLocaleString("default", {month: "long"});
        const year = date.getFullYear();
        return {monthName, year};
    }, [monthDate]);
    const handleFormSubmit = (): void => {
        reset();
        closeModal();
        handleEdit();
    };
    const onSubmit: SubmitHandler<WorkloadFormFields> = async (
        data
    ): Promise<void> => {
        try {
            if (person.workPerson === undefined) {
                const workload: CreateOccupancyRequest = {
                    projectId: projectId,
                    personId: person.person.id,
                    toMonth: monthDate,
                    fromMonth: monthDate,
                    value: data.pmValue,
                };
                console.log("create", workload);
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
                    console.log("create 2", workload);
                    const response = await occupancyAPI.addOccupancy(workload, await requestArgs.getRequestArgs());
                    if (response.status === 201) {
                        handleFormSubmit();
                    }
                } else if (data.pmValue == 0 && person.workPerson.occupancyId) {
                    console.log("delete");
                    const response = await occupancyAPI.deleteOccupancy(
                        person.workPerson.occupancyId,
                        await requestArgs.getRequestArgs()
                    );
                    if (response.status === 200) {
                        handleFormSubmit();
                    }
                } else {
                    const workload: UpdateOccupancyRequest = {
                        occupancyId: person.workPerson.occupancyId,
                        value: data.pmValue,
                    };
                    console.log("update", workload);
                    const response = await occupancyAPI.updateOccupancy(
                        workload,
                        await requestArgs.getRequestArgs()
                    );
                    if (response.status === 200) {
                        handleFormSubmit();
                    }
                }
            }
        } catch (error) {
            RequestUtil.handleAxiosRequestError(error);;
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
                            { personType?.maxAvailability ?
                                <>
                                    <div>
                                        This month's remaining availability:
                                    </div>
                                    <div className="font-semibold">
                                        {personType?.maxAvailability + " PM"}
                                    </div>
                                </> :
                                <div>
                                    This user does not have availability yet assigned.
                                </div>
                            }
                        </div>
                        <div className="flex flex-col">
                            <Label>Assign personal months:</Label>
                            <TextInput
                                type="number"
                                className="w-[300px]"
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

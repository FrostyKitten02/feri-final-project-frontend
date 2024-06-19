import {useEffect, useState} from "react";
import AddProjectIcon from "../../../assets/icons/folder-badge-plus.svg?react";
import {Datepicker, Label, Select, TextInput} from "flowbite-react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {AddProjectFormFields} from "../../../types/forms/formTypes";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {CreateProjectRequest, ProjectBudgetSchemaDto} from "../../../../temp_ts";
import {LuEuro} from "react-icons/lu";
import {ProjectModalProps} from "../../../interfaces";
import {
    CustomModal, CustomModalBody,
    CustomModalError, CustomModalFooter,
    CustomModalHeader, ModalDivider,
    ModalText,
    ModalTitle
} from "../../template/modal/CustomModal";
import TextUtil from "../../../util/TextUtil";

export const ProjectModal = ({handleAddProject}: ProjectModalProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>();
    const {register, watch, control, reset, handleSubmit, formState: {errors}} = useForm<AddProjectFormFields>();
    const [budgetSchemas, setBudgetSchemas] = useState<ProjectBudgetSchemaDto[]>([]);
    const watchStartDate = watch("startDate");
    const requestArgs = useRequestArgs();

    useEffect(() => {
        const fetchBudgetSchemas = async (): Promise<void> => {
            try {
                const response = await projectSchemaAPI.getAllProjectBudgetSchema(
                    requestArgs
                );
                if (response.status === 200) {
                    if (response.data.projectBudgetSchemaDtoList)
                        setBudgetSchemas(response.data.projectBudgetSchemaDtoList);
                }
            } catch (error: any) {
                toastError(error.message);
            }
        };
        fetchBudgetSchemas();
    }, []);

    const onSubmit: SubmitHandler<AddProjectFormFields> = async (
        data
    ): Promise<void> => {
        const project: CreateProjectRequest = {
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            projectBudgetSchemaId: data.projectBudgetSchemaId,
            staffBudget: data.staffBudget,
            travelBudget: data.travelBudget,
            equipmentBudget: data.equipmentBudget,
            subcontractingBudget: data.subcontractingBudget,
        };
        try {
            const response = await projectAPI.createProject(project, requestArgs);
            if (response.status === 201) {
                reset();
                setModalOpen(false);
                handleAddProject();
                toastSuccess(
                    `Project with id ${response.data.id} was successfully created!`
                );
            }
        } catch (error: any) {
            toastError(`An error has occured: ${error.message}`);
        }
    };

    return (
        <>
            <button onClick={() => setModalOpen(true)}>
                <AddProjectIcon className="h-12 w-12 fill-black hover:fill-primary transition delay-50"/>
            </button>
            {
                modalOpen &&
                <CustomModal closeModal={() => setModalOpen(false)}
                             modalWidth="700px">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CustomModalHeader handleModalOpen={() => setModalOpen(false)}>
                            <ModalTitle>
                                Create a project
                            </ModalTitle>
                            <ModalText showInfoIcon={true} showWarningIcon={false} contentColor="muted">
                                Information provided in the form can be changed later on.
                            </ModalText>
                        </CustomModalHeader>
                        <CustomModalBody>
                            <div>
                                <Label>
                                    Project title
                                </Label>
                                <TextInput helperText="Aim to keep your project title brief and concise."
                                           type="text"
                                           {...register("title", {
                                               required: "Title can not be empty!",
                                           })}
                                />
                                <CustomModalError error={errors.title?.message}/>

                            </div>
                            <div className="flex flex-row justify-between pt-6">
                                <div className="w-[270px]">
                                    <Label>
                                        Start date
                                    </Label>
                                    <Controller name="startDate"
                                                defaultValue={''}
                                                control={control}
                                                rules={{
                                                    required: "Start date is required!",
                                                    validate: value => {
                                                        if (!value) {
                                                            return "Start date is required!";
                                                        }
                                                    }
                                                }}
                                                render={({field}) => (
                                                    <Datepicker
                                                        {...field}
                                                        placeholder="Select start date."
                                                        onSelectedDateChanged={(date) => field.onChange(TextUtil.formatFormDate(date))}/>
                                                )}/>
                                    <CustomModalError error={errors.startDate?.message}/>
                                </div>
                                <div className="w-[270px]">
                                    <Label>
                                        End date
                                    </Label>
                                    <Controller name="endDate"
                                                defaultValue={''}
                                                control={control}
                                                rules={{
                                                    required: "End date is required!",
                                                    validate: value => {
                                                        if (!value) {
                                                            return "End date is required!";
                                                        }
                                                        if (value < watchStartDate) {
                                                            return "End date cannot be before start date!";
                                                        }
                                                        return true;
                                                    }
                                                }}
                                                render={({field}) => (
                                                    <Datepicker
                                                        {...field}
                                                        placeholder="Select end date."
                                                        onSelectedDateChanged={(date) => field.onChange(TextUtil.formatFormDate(date))}/>
                                                )}/>
                                    <CustomModalError error={errors.endDate?.message}/>
                                </div>
                            </div>
                            <ModalDivider>
                                budget
                            </ModalDivider>
                            <div className="flex flex-row justify-between">
                                <div className="w-[270px]">
                                    <Label>
                                        Schema
                                    </Label>
                                    <Controller
                                        name="projectBudgetSchemaId"
                                        control={control}
                                        defaultValue={undefined}
                                        rules={{
                                            required: "Schema must be defined!",
                                            validate: value => {
                                                if (!value) {
                                                    return "Schema must be defined!";
                                                }
                                                return true;
                                            }
                                        }}
                                        render={({field}) => (
                                            <Select
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                value={field.value ? field.value : ""}
                                            >
                                                <option value="" disabled>Select a budget schema</option>
                                                {budgetSchemas.map((schema) => (
                                                    <option key={schema.id} value={schema.id}>
                                                        {schema.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <CustomModalError error={errors.projectBudgetSchemaId?.message}/>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between pt-6">
                                <div className="w-[270px]">
                                    <Label>
                                        Staff
                                    </Label>
                                    <TextInput type="number"
                                               min="0"
                                               rightIcon={LuEuro}
                                               {...register("staffBudget", {
                                                   required: "Staff can not be empty!",
                                               })}
                                    />
                                    <CustomModalError error={errors.staffBudget?.message}/>
                                </div>
                                <div className="w-[270px]">
                                    <Label>
                                        Travel
                                    </Label>
                                    <TextInput type="number"
                                               min="0"
                                               rightIcon={LuEuro}
                                               {...register("travelBudget", {
                                                   required: "Travel can not be empty!",
                                               })}
                                    />
                                    <CustomModalError error={errors.travelBudget?.message}/>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between pt-6">
                                <div className="w-[270px]">
                                    <Label>
                                        Equipment
                                    </Label>
                                    <TextInput type="number"
                                               min="0"
                                               rightIcon={LuEuro}
                                               {...register("equipmentBudget", {
                                                   required: "Equipment can not be empty!",
                                               })}
                                    />
                                    <CustomModalError error={errors.equipmentBudget?.message}/>
                                </div>
                                <div className="w-[270px]">
                                    <Label>
                                        Subcontracting
                                    </Label>
                                    <TextInput type="number"
                                               min="0"
                                               rightIcon={LuEuro}
                                               {...register("subcontractingBudget", {
                                                   required: "Subcontracting can not be empty!",
                                               })}
                                    />
                                    <CustomModalError error={errors.subcontractingBudget?.message}/>
                                </div>
                            </div>
                        </CustomModalBody>
                        <CustomModalFooter>
                            Create
                        </CustomModalFooter>
                    </form>
                </CustomModal>
            }
        </>
    )
}
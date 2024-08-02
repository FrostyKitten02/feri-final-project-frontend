import {useEffect, useState} from "react";
import {Datepicker, Label, Select, TextInput} from "flowbite-react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {AddProjectFormFields} from "../../../types/types";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {CreateProjectRequest, GetProjectResponse, ProjectBudgetSchemaDto, UpdateProjectRequest} from "../../../../temp_ts";
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
import {FiEdit3, FiFolderPlus} from "react-icons/fi";

export const ProjectModal = ({handleAddProject, edit, projectId}: ProjectModalProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>();
    const {register, watch, control, reset, handleSubmit, formState: {errors}} = useForm<AddProjectFormFields>();
    const [budgetSchemas, setBudgetSchemas] = useState<ProjectBudgetSchemaDto[]>([]);
    const [projectDetails, setProjectDetails] = useState<GetProjectResponse>();
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
        fetchProjectById();
    }, []);

    useEffect(() => {
        fetchProjectById();
    }, [handleAddProject])

    const handleCloseEdit = (): void => {
        reset();
        setModalOpen(false);
    };

    const fetchProjectById = async (): Promise<void> => {
        try {
            if (projectId) {
                const response = await projectAPI.getProject(projectId, requestArgs)
                if (response.status === 200) {
                    setProjectDetails(response.data)
                } else {
                    toastError("Project id not found.")
                }
            }
        } catch (error: any) {
            toastError(error.message);
        }
    }

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

    const onEdit: SubmitHandler<AddProjectFormFields> = async (data): Promise<void> => {
        const project: UpdateProjectRequest = {
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            projectBudgetSchemaId: data.projectBudgetSchemaId,
            staffBudget: data.staffBudget,
            travelBudget: data.travelBudget,
            equipmentBudget: data.equipmentBudget,
            subcontractingBudget: data.subcontractingBudget
        }
        try {
            if (projectId) {
                console.log(project);
                const response = await projectAPI.updateProject(projectId, project, requestArgs);
                if (response.status === 200) {
                    reset();
                    handleAddProject();
                    setModalOpen(false);
                    toastSuccess("Project " + projectDetails?.projectDto?.title + " was successfully updated.");
                }
            } else {
                toastError("Project id not found.")
            }
        } catch (error: any) {
            toastError(error.message);
        }
    }

    return (
        <>
            {edit ? (
                <button onClick={() => setModalOpen(true)}>
                    <FiEdit3 className="size-6 stroke-gray-700 hover:stroke-primary transition delay-50"/>
                </button>
            ) : (
                <button onClick={() => setModalOpen(true)}>
                    <FiFolderPlus className="h-12 w-12 transition delay-50" />
                </button> 
            )}
            
            {
                modalOpen &&
                <CustomModal closeModal={!edit ? () => setModalOpen(false) : handleCloseEdit}
                             modalWidth="700px">
                    <form onSubmit={!edit ? handleSubmit(onSubmit) : handleSubmit(onEdit)}>
                        <CustomModalHeader handleModalOpen={!edit ? () => setModalOpen(false) : handleCloseEdit}>
                            <ModalTitle>
                                {!edit ? <span>Create a project</span> : <span>Edit project: {projectDetails?.projectDto?.title}</span>}
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
                                           defaultValue={!edit ? "" : projectDetails?.projectDto?.title}
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
                                                defaultValue={!edit ? '' : projectDetails?.projectDto?.startDate}
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
                                                        defaultDate={!edit ? new Date(Date.now()) : new Date(projectDetails?.projectDto?.startDate || Date.now())}
                                                        onSelectedDateChanged={(date) => field.onChange(TextUtil.formatFormDate(date))}/>
                                                )}/>
                                    <CustomModalError error={errors.startDate?.message}/>
                                </div>
                                <div className="w-[270px]">
                                    <Label>
                                        End date
                                    </Label>
                                    <Controller name="endDate"
                                                defaultValue={!edit ? '' : projectDetails?.projectDto?.endDate}
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
                                                        defaultDate={!edit ? new Date(Date.now()) : new Date(projectDetails?.projectDto?.endDate || Date.now())}
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
                                        defaultValue={!edit ? undefined : projectDetails?.projectDto?.projectBudgetSchemaId}
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
                                                onChange={(e) => {field.onChange(e.target.value)}}
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
                                               defaultValue={!edit ? "" : projectDetails?.projectDto?.staffBudget}
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
                                               defaultValue={!edit ? "" : projectDetails?.projectDto?.travelBudget}
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
                                               defaultValue={!edit ? "" : projectDetails?.projectDto?.equipmentBudget}
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
                                               defaultValue={!edit ? "" : projectDetails?.projectDto?.subcontractingBudget}
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
                            {!edit ? <span>Create</span> : <span>Confirm</span>}
                        </CustomModalFooter>
                    </form>
                </CustomModal>
            }
        </>
    )
}
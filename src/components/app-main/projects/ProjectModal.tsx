import {useEffect, useState} from "react";
import {Datepicker, Label, Select, TextInput} from "flowbite-react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {AddProjectFormFields} from "../../../types/types";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {CreateProjectRequest, ProjectBudgetSchemaDto, UpdateProjectRequest,} from "../../../../client";
import {LuEuro} from "react-icons/lu";
import {ProjectModalProps} from "../../../interfaces";
import {
    CustomModal,
    CustomModalBody,
    CustomModalError,
    CustomModalFooter,
    CustomModalHeader,
    ModalDivider,
    ModalText,
    ModalTitle,
} from "../../template/modal/CustomModal";
import TextUtil from "../../../util/TextUtil";
import ModalPortal from "../../template/modal/ModalPortal";
import {FiEdit3} from "react-icons/fi";
import {BsFolderPlus} from "react-icons/bs";
import RequestUtil from "../../../util/RequestUtil";

export const ProjectModal = ({
                                 handleProjectSubmit,
                                 edit = false,
                                 popoverEdit = false,
                                 project,
                                 projectId,
                                 callToAction
                             }: ProjectModalProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const {
        register,
        watch,
        control,
        reset,
        handleSubmit,
        formState: {errors},
    } = useForm<AddProjectFormFields>();
    const [budgetSchemas, setBudgetSchemas] = useState<ProjectBudgetSchemaDto[]>([]);
    const watchStartDate = watch("startDate");
    const requestArgs = useRequestArgs();

    useEffect(() => {
        if (modalOpen) {
            fetchBudgetSchemas();
        }
    }, [modalOpen, project]);

    const fetchBudgetSchemas = async (): Promise<void> => {
        try {
            const response = await projectSchemaAPI.getAllProjectBudgetSchema(
                await requestArgs.getRequestArgs()
            );
            if (response.status === 200) {
                if (response.data.projectBudgetSchemaDtoList)
                    setBudgetSchemas(response.data.projectBudgetSchemaDtoList);
            }
        } catch (error) {
            RequestUtil.handleAxiosRequestError(error);;
        }
    };

    const handleCloseEdit = (): void => {
        reset();
        setModalOpen(false);
    };

    const handleFormSubmit = (): void => {
        reset();
        handleProjectSubmit?.();
        setModalOpen(false);
    };

    const onSubmit: SubmitHandler<AddProjectFormFields> = async (
        data
    ): Promise<void> => {
        const project: CreateProjectRequest | UpdateProjectRequest = {
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
            let response;
            if (edit) {
                if (projectId) {
                    response = await projectAPI.updateProject(
                        projectId,
                        project,
                        await requestArgs.getRequestArgs()
                    );
                    if (response.status === 200) {
                        handleFormSubmit();
                        toastSuccess(
                            "Project " +
                            project.title +
                            " was successfully updated."
                        );
                    }
                } else {
                    toastError("Project id not found.");
                }
            } else {
                response = await projectAPI.createProject(project, await requestArgs.getRequestArgs());
                if (response.status === 201) {
                    handleFormSubmit();
                    toastSuccess(
                        `Project ${data.title} was successfully created!`
                    );
                }
            }
        } catch (error) {
            RequestUtil.handleAxiosRequestError(error);
        }
    };

    return (
        <>
            {edit ? (
                popoverEdit ? (
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex flex-row items-center justify-start text-gray-500 h-full text-sm font-semibold hover:text-gray-800 transition delay-50 gap-x-4"
                    >
                        <span className="uppercase">edit project</span>
                    </button>
                ) : (
                    <button onClick={() => setModalOpen(true)}>
                        <FiEdit3 className="size-5 hover:stroke-primary transition delay-50"/>
                    </button>
                )
            ) : !callToAction ? (
                <button onClick={() => setModalOpen(true)}>
                    <BsFolderPlus className="h-10 w-10 transition delay-50 hover:fill-primary delay-50"/>
                </button>
            ) : <button
                onClick={() => setModalOpen(true)}
                className={`w-44 h-16 rounded-2xl border-solid border-2 border-gray-200 flex items-center justify-center hover:bg-gray-100 transition delay-50`}
                >
                    <span className="text-lg font-semibold">Create new project</span>
                </button>}
            {modalOpen && (
                <ModalPortal>
                    <CustomModal
                        closeModal={!edit ? () => setModalOpen(false) : handleCloseEdit}
                        modalWidth="700px"
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CustomModalHeader
                                handleModalClose={
                                    !edit ? () => setModalOpen(false) : handleCloseEdit
                                }
                            >
                                <ModalTitle>
                                    {!edit ? (
                                        <span>Create a project</span>
                                    ) : (
                                        <span>
                      Edit project: {project?.title}
                    </span>
                                    )}
                                </ModalTitle>
                                <ModalText showIcon={true} contentColor="muted">
                                    Information provided in the form can be changed later on.
                                </ModalText>
                            </CustomModalHeader>
                            <CustomModalBody>
                                <div>
                                    <Label>Project title</Label>
                                    <TextInput
                                        helperText="Aim to keep your project title brief and concise."
                                        type="text"
                                        defaultValue={edit ? project?.title : ""}
                                        {...register("title", {
                                            required: "Title can not be empty!",
                                        })}
                                    />
                                    <CustomModalError error={errors.title?.message}/>
                                </div>
                                <div className="flex flex-row justify-between pt-6">
                                    <div className="w-[270px]">
                                        <Label>Start date</Label>
                                        <Controller
                                            name="startDate"
                                            defaultValue={
                                                !edit ? "" : project?.startDate
                                            }
                                            control={control}
                                            rules={{
                                                required: "Start date is required!",
                                                validate: (value) => {
                                                    if (!value) {
                                                        return "Start date is required!";
                                                    }
                                                },
                                            }}
                                            render={({field}) => (
                                                <Datepicker
                                                    {...field}
                                                    placeholder="Select start date."
                                                    defaultDate={
                                                        !edit
                                                            ? new Date(Date.now())
                                                            : new Date(
                                                                project?.startDate ??
                                                                Date.now()
                                                            )
                                                    }
                                                    onSelectedDateChanged={(date) =>
                                                        field.onChange(TextUtil.formatFormDate(date))
                                                    }
                                                />
                                            )}
                                        />
                                        <CustomModalError error={errors.startDate?.message}/>
                                    </div>
                                    <div className="w-[270px]">
                                        <Label>End date</Label>
                                        <Controller
                                            name="endDate"
                                            defaultValue={
                                                !edit ? "" : project?.endDate
                                            }
                                            control={control}
                                            rules={{
                                                required: "End date is required!",
                                                validate: (value) => {
                                                    if (!value) {
                                                        return "End date is required!";
                                                    }
                                                    if (value < watchStartDate) {
                                                        return "End date cannot be before start date!";
                                                    }
                                                    return true;
                                                },
                                            }}
                                            render={({field}) => (
                                                <Datepicker
                                                    {...field}
                                                    placeholder="Select end date."
                                                    defaultDate={
                                                        !edit
                                                            ? new Date(Date.now())
                                                            : new Date(
                                                                project?.endDate ??
                                                                Date.now()
                                                            )
                                                    }
                                                    onSelectedDateChanged={(date) =>
                                                        field.onChange(TextUtil.formatFormDate(date))
                                                    }
                                                />
                                            )}
                                        />
                                        <CustomModalError error={errors.endDate?.message}/>
                                    </div>
                                </div>
                                <ModalDivider>budget</ModalDivider>
                                <div className="flex flex-row justify-between">
                                    <div className="w-[270px]">
                                        <Label>Schema</Label>
                                        <Controller
                                            name="projectBudgetSchemaId"
                                            control={control}
                                            defaultValue={
                                                edit
                                                    ? project?.projectBudgetSchemaId
                                                    : ""
                                            }
                                            rules={{
                                                required: "Schema must be defined!",
                                                validate: (value) => {
                                                    if (!value) {
                                                        return "Schema must be defined!";
                                                    }
                                                    return true;
                                                },
                                            }}
                                            render={({field}) => (
                                                <Select
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value)
                                                    }}
                                                    value={field.value ? field.value : ""}
                                                >
                                                    <option value="" disabled>
                                                        Select a budget schema
                                                    </option>
                                                    {budgetSchemas.map((schema) => (
                                                        <option key={schema.id} value={schema.id}>
                                                            {schema.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        <CustomModalError
                                            error={errors.projectBudgetSchemaId?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between pt-6">
                                    <div className="w-[270px]">
                                        <Label>Staff</Label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            defaultValue={
                                                !edit ? "" : project?.staffBudget
                                            }
                                            rightIcon={LuEuro}
                                            {...register("staffBudget", {
                                                required: "Staff can not be empty!",
                                            })}
                                        />
                                        <CustomModalError error={errors.staffBudget?.message}/>
                                    </div>
                                    <div className="w-[270px]">
                                        <Label>Travel</Label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            defaultValue={
                                                !edit ? "" : project?.travelBudget
                                            }
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
                                        <Label>Equipment</Label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            defaultValue={
                                                !edit ? "" : project?.equipmentBudget
                                            }
                                            rightIcon={LuEuro}
                                            {...register("equipmentBudget", {
                                                required: "Equipment can not be empty!",
                                            })}
                                        />
                                        <CustomModalError error={errors.equipmentBudget?.message}/>
                                    </div>
                                    <div className="w-[270px]">
                                        <Label>Subcontracting</Label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            defaultValue={
                                                !edit
                                                    ? ""
                                                    : project?.subcontractingBudget
                                            }
                                            rightIcon={LuEuro}
                                            {...register("subcontractingBudget", {
                                                required: "Subcontracting can not be empty!",
                                            })}
                                        />
                                        <CustomModalError
                                            error={errors.subcontractingBudget?.message}
                                        />
                                    </div>
                                </div>
                            </CustomModalBody>
                            <CustomModalFooter>
                                {!edit ? <span>Create</span> : <span>Confirm</span>}
                            </CustomModalFooter>
                        </form>
                    </CustomModal>
                </ModalPortal>
            )}
        </>
    );
};

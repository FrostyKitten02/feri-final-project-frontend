import {useEffect, useState} from "react";
import AddProjectIcon from "../../../assets/icons/folder-badge-plus.svg?react";
import Backdrop from "../../template/modal/Backdrop";
import {Datepicker, Label, Select, TextInput} from "flowbite-react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {AddProjectFormFields} from "../../../types/forms/formTypes";
import {useRequestArgs} from "../../../util/CustomHooks";
import {projectAPI, projectSchemaAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {CreateProjectRequest, ProjectBudgetSchemaDto} from "../../../../temp_ts";
import {LuEuro} from "react-icons/lu";
import {IoMdClose} from "react-icons/io";
import {IoMdInformationCircleOutline} from "react-icons/io";
import {ProjectModalProps} from "../../../interfaces";
import {CustomModalError} from "../../template/modal/CustomModal";
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
                <AddProjectIcon className="h-12 w-12 fill-black hover:fill-secondary"/>
            </button>
            {
                modalOpen &&
                <Backdrop closeModal={() => setModalOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}
                         className="bg-white rounded-xl w-[650px]">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-row p-6 border-gray-300 border-b-[1px] border-solid">
                                <div className="flex-grow">
                                    <div className="uppercase font-bold text-2xl">
                                        Create a project
                                    </div>
                                    <div className="flex items-center text-muted pt-1">
                                        <IoMdInformationCircleOutline/>
                                        <div className="px-1 text-sm">
                                            Information provided in the form can be changed later on.
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => setModalOpen(false)}>
                                        <IoMdClose/>
                                    </button>
                                </div>
                            </div>
                            <div className="p-10">
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
                                    <div className="w-[250px]">
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
                                    <div className="w-[250px]">
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
                                <div className="flex flex-row items-center pb-6 pt-12">
                                    <div className="w-[7%] h-[1px] bg-muted"/>
                                    <Label className="px-2 uppercase text-muted">
                                        budget
                                    </Label>
                                    <div className="flex-grow h-[1px] bg-muted"/>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div className="w-[250px]">
                                        <Label>
                                            Schema
                                        </Label>
                                        <Controller
                                            name="projectBudgetSchemaId"
                                            control={control}
                                            defaultValue={undefined}
                                            rules={{
                                                required: "Schema is not defined!",
                                                validate: value => {
                                                    if (!value) {
                                                        return "Schema is not defined!";
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
                                        <CustomModalError error={errors.projectBudgetSchemaId?.message} />
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between pt-6">
                                    <div className="w-[250px]">
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
                                    <div className="w-[250px]">
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
                                    <div className="w-[250px]">
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
                                    <div className="w-[250px]">
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
                            </div>
                            <div className="flex justify-end border-t-[1px] border-solid border-gray-300 p-6">
                                <button type="submit"
                                        className="uppercase tracking-wider px-10 py-2 bg-primary transition delay-50 hover:bg-[#5080B0] text-white rounded-xl">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </Backdrop>
            }
        </>

    )
}
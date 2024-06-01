import { useEffect, useState } from "react";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";
import CloseIcon from "../../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";
import {
  CreateProjectRequest,
  ProjectBudgetSchemaDto,
} from "../../../../../temp_ts";
import { toastError, toastSuccess } from "../../../toast-modals/ToastFunctions";
import { projectAPI, projectSchemaAPI } from "../../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../../util/CustomHooks";
import { AddNewProjectModalProps } from "../../../../interfaces";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AddProjectFormFields } from "../../../../types/forms/formTypes";

export default function AddNewProjectPage({
  handleClose,
  handleAddProject,
}: AddNewProjectModalProps) {
  const [budgetSchemas, setBudgetSchemas] = useState<ProjectBudgetSchemaDto[]>(
    []
  );
  //const [schemaId, setSchemaId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProjectFormFields>();
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  const requestArgs = useRequestArgs();

  useEffect(() => {
    fetchBudgetSchemas();
  }, []);

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

  const onSubmit: SubmitHandler<AddProjectFormFields> = async (
    data
  ): Promise<void> => {
    const project: CreateProjectRequest = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      projectBudgetSchemaId: data.projectBudgetSchema.id,
      staffBudget: data.staffBudget,
      travelBudget: data.travelBudget,
      equipmentBudget: data.equipmentBudget,
      subcontractingBudget: data.subcontractingBudget,
    };

    try {
      const response = await projectAPI.createProject(project, requestArgs);
      if (response.status === 201) {
        handleClose();
        handleAddProject();
        toastSuccess(
          `Project with id ${response.data.id} was successfully created!`
        );
      }
      console.log(response);
    } catch (error: any) {
      console.error(error);
      toastError(`An error has occured: ${error.message}`);
    }
  };

  const dropIn = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        className="w-2/3"
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col bg-white rounded-2xl border-solid border-2 border-gray-200">
          <div className="flex flex-row px-8 pt-8 pb-12">
            <div className="flex w-1/2 jutify-start">
              <h1 className="text-black font-semibold text-xl">
                Add new project
              </h1>
            </div>
            <div className="flex w-1/2 justify-end">
              <CloseIcon
                onClick={handleClose}
                className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
              />
            </div>
          </div>
          <div className="px-16 pb-16">
            <form
              action="post"
              className="space-y-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-row space-x-6">
                <div className="flex flex-col w-1/2 space-y-6">
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold text-lg">
                      Title
                    </label>
                    <input
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      type="text"
                      placeholder="Enter project title"
                      {...register("title", {
                        required: "Title can not be empty!",
                      })}
                    />
                    {errors.title && (
                      <div className="text-red-500 font-semibold">
                        {errors.title.message}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-col w-1/2">
                      <label className="text-gray-700 font-semibold text-lg">
                        Start date
                      </label>
                      <input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        type="date"
                        {...register("startDate", {
                          required: "Start date can not be empty!",
                          validate: (value) => {
                            if (value > watchEndDate) {
                              return "Start date must be before end date!";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.startDate && (
                        <div className="text-red-500 font-semibold">
                          {errors.startDate.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="text-gray-700 font-semibold text-lg">
                        End date
                      </label>
                      <input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        type="date"
                        {...register("endDate", {
                          required: "End date can not be empty",
                          validate: (value) => {
                            if (value < watchStartDate) {
                              return "End date must be after start date!";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.endDate && (
                        <div className="text-red-500 font-semibold">
                          {errors.endDate.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-1/2 space-y-6">
                  <div className="flex flex-col">
                    <label>Budget schema</label>
                    <Controller
                      name="projectBudgetSchema"
                      control={control}
                      defaultValue={undefined}
                      render={({ field }) => (
                        <div className="relative flex">
                          <input
                            type="text"
                            placeholder="Select schema"
                            value={field.value && field.value.name}
                            onClick={() => setIsOpen(!isOpen)}
                            readOnly
                            className="cursor-pointer px-4 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200 rounded-md py-2"
                          />
                          {isOpen && (
                            <div className="absolute z-10 mt-10 backdrop-blur-xl w-1/2">
                              <div className="border border-solid border-gray-200 overflow-auto max-h-60">
                                {budgetSchemas.map((schema) => (
                                  <div
                                    key={schema.id}
                                    onClick={() => {
                                      field.onChange(schema);
                                      setIsOpen(false);
                                      /*
                                      {
                                        if (schema?.id) setSchemaId(schema.id);
                                      }
                                      */
                                    }}
                                  >
                                    {schema.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <label>Staff budget</label>
                      <input
                        type="number"
                        {...register("staffBudget", {
                          required: "Staff budget can not be empty.",
                        })}
                      />
                      {errors.staffBudget && (
                        <div className="text-red-500 font-semibold">
                          {errors.staffBudget.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label>Travel budget</label>
                      <input
                        type="number"
                        {...register("travelBudget", {
                          required: "Travel budget can not be empty.",
                        })}
                      />
                      {errors.travelBudget && (
                        <div className="text-red-500 font-semibold">
                          {errors.travelBudget.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <label>Equipment budget</label>
                      <input
                        type="number"
                        {...register("equipmentBudget", {
                          required: "Equipment budget can not be empty.",
                        })}
                      />
                      {errors.equipmentBudget && (
                        <div className="text-red-500 font-semibold">
                          {errors.equipmentBudget.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label>Subcontracting budget</label>
                      <input
                        type="number"
                        {...register("subcontractingBudget", {
                          required: "Subcontracting budget can not be empty.",
                        })}
                      />
                      {errors.subcontractingBudget && (
                        <div className="text-red-500 font-semibold">
                          {errors.subcontractingBudget.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                  type="submit"
                >
                  Add project
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
}

import { useEffect, useMemo, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
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
import {
  AddPersonToProjectRequest,
  GetProjectResponse,
  ListPersonResponse,
  MonthlyPersonOccupancyDto,
  PageInfoRequest,
  PersonDto,
  PersonListSearchParams,
  PersonSortInfoRequest,
  SalaryDto,
} from "../../../../temp_ts";
import { Datepicker, Label, TextInput } from "flowbite-react";
import { toastSuccess, toastWarning } from "../../toast-modals/ToastFunctions";
import {
  occupancyAPI,
  personAPI,
  projectAPI,
} from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AssignPersonFormFields } from "../../../types/types";
import { useParams } from "react-router-dom";
import { TeamModalProps } from "../../../interfaces";
import UserSearchInput from "../../template/search-user/UserSearchInput";
import { motion } from "framer-motion";
import TextUtil from "../../../util/TextUtil";
import RequestUtil from "../../../util/RequestUtil";

export default function TeamModal({ handleAddPerson }: TeamModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allPeople, setAllPeople] = useState<ListPersonResponse>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState<string>(searchQuery);
  const [inputValue, setInputValue] = useState<string>("");
  const [listOpen, setListOpen] = useState<boolean>(false);
  const [userSalary, setUserSalary] = useState<SalaryDto>({
    amount: undefined,
  });
  const [userOccupancy, setUserOccupancy] = useState<
    MonthlyPersonOccupancyDto[]
  >([]);
  const [projectDetails, setProjectDetails] =
    useState<GetProjectResponse | null>(null);

  const requestArgs = useRequestArgs();
  const { projectId } = useParams();

  // DEBOUNCE HOOK SO THE USER CAN'T SPAM API CALLS
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (modalOpen) {
      fetchAllPeople();
    }
  }, [debouncedSearchQuery]);

  const fetchAllPeople = async (): Promise<void> => {
    const pageInfo: PageInfoRequest = {
      elementsPerPage: 4,
      pageNumber: 1,
    };
    const sortInfo: PersonSortInfoRequest = {
      ascending: true,
      fields: ["NAME"],
    };
    const searchParams: PersonListSearchParams = {
      searchStr: debouncedSearchQuery,
    };

    try {
      const response = await personAPI.listPeople(
        pageInfo,
        sortInfo,
        searchParams,
        await requestArgs.getRequestArgs()
      );
      if (response.status === 200) {
        setAllPeople(response.data);
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    }
  };

  const filteredPeople = useMemo((): PersonDto[] => {
    if (debouncedSearchQuery.trim() === "") {
      setListOpen(false);
      setUserSalary({ ...userSalary, amount: undefined });
      return [];
    } else {
      setListOpen(true);
      return (allPeople?.people ?? []).filter((person) =>
        `${person.name} ${person.lastname} ${person.email}`
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      );
    }
  }, [debouncedSearchQuery, allPeople]);

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<AssignPersonFormFields>();
  const watchPerson = watch("person");
  const watchStartDate = watch("startDate");

  const handleSelectPerson = (person: PersonDto): void => {
    setValue("person", person);
    if (person.name && person.lastname) {
      setInputValue(`${person.name} ${person.lastname}`);
    } else {
      setInputValue(`${person.email}`);
    }
    setListOpen(false);

    const fetchSalaryforUser = async (): Promise<void> => {
      if (!person.id) return;
      try {
        const response = await personAPI.getPersonById(
          person?.id,
          await requestArgs.getRequestArgs()
        );
        if (response.status === 200) {
          setUserSalary({
            ...userSalary,
            amount: response.data.currentSalary?.amount,
          });
        }
      } catch (error) {
        RequestUtil.handleAxiosRequestError(error);
      }
    };

    const fetchOccupancyForUser = async (
      projectData: GetProjectResponse
    ): Promise<void> => {
      if (!person.id) return;
      try {
        if (
          projectData?.projectDto?.startDate &&
          projectData.projectDto.endDate
        ) {
          const response = await occupancyAPI.getMonthlyPersonOccupancy(
            projectData?.projectDto?.startDate,
            projectData?.projectDto?.endDate,
            person.id,
            await requestArgs.getRequestArgs()
          );
          if (response.status === 200) {
            setUserOccupancy(response.data.monthlyPersonOccupancies ?? []);
          }
        } else {
          toastWarning("Project start date or end date is undefined!");
        }
      } catch (error) {
        RequestUtil.handleAxiosRequestError(error);
      }
    };

    const fetchProjectById = async (): Promise<void> => {
      try {
        if (projectId) {
          const response = await projectAPI.getProject(
            projectId,
            await requestArgs.getRequestArgs()
          );
          if (response.status === 200) {
            setProjectDetails(response.data);
            await fetchOccupancyForUser(response.data);
          }
        } else {
          toastWarning("Project id not found");
        }
      } catch (error) {
        RequestUtil.handleAxiosRequestError(error);
      }
    };

    fetchSalaryforUser();

    if (!projectDetails) {
      fetchProjectById();
    }
  };

  const handleClose = (): void => {
    reset();
    setSearchQuery("");
    setInputValue("");
    setUserSalary({ ...userSalary, amount: undefined });
    setUserOccupancy([]);
    setProjectDetails(null);
    setModalOpen(false);
  };

  const resetField = (): void => {
    reset();
    setUserSalary({ ...userSalary, amount: undefined });
    setUserOccupancy([]);
  };

  const onSubmit: SubmitHandler<AssignPersonFormFields> = async (
    data
  ): Promise<void> => {
    try {
      if (projectId && data.person.id) {
        const person: AddPersonToProjectRequest = {
          personId: data.person.id,
          from: data.startDate,
          to: data.endDate,
          estimatedPm: data.personMonths,
        };

        const response = await projectAPI.addPersonToProject(
          projectId,
          person,
          await requestArgs.getRequestArgs()
        );
        if (response.status === 204) {
          handleClose();
          toastSuccess(
            data.person.name +
              " " +
              data.person.lastname +
              " was successfully added to the project."
          );
          handleAddPerson();
        }
      } else {
        toastWarning("Project or person id not found.");
      }
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    }
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        <BsPersonAdd className="fill-black size-12 transition delay-50 hover:fill-primary" />
      </button>
      {modalOpen && (
        <CustomModal closeModal={handleClose} modalWidth="950px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomModalHeader handleModalClose={handleClose}>
              <ModalTitle>Assign person to project</ModalTitle>
              <ModalText showIcon={true} contentColor="warning">
                Only available employees should be assigned to the project.
              </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
              <div>
                <Label>Select employee</Label>
                <Controller
                  control={control}
                  rules={{
                    required:
                      "Field can not be empty! Please select an employee.",
                    validate: (value) => {
                      if (!value || !watchPerson?.id) {
                        return "Please select a valid employee.";
                      }
                      return true;
                    },
                  }}
                  name="person"
                  render={({ field }) => (
                    <UserSearchInput<AssignPersonFormFields, "person">
                      setListOpen={setListOpen}
                      field={field}
                      setInputValue={setInputValue}
                      setSearchQuery={setSearchQuery}
                      inputValue={inputValue}
                      listOpen={listOpen}
                      filteredPeople={filteredPeople}
                      handleSelectPerson={handleSelectPerson}
                      setHookFormValue={resetField}
                      inputWidth={700}
                      showResults={true}
                    />
                  )}
                />
                <CustomModalError error={errors.person?.message} />
              </div>
              {watchPerson?.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ModalDivider>duration</ModalDivider>
                  <ModalText showIcon={true}>
                    <div className="flex items-center text-black text-md pb-6">
                      <div>Remember that project starts on</div>
                      <div className="font-semibold px-[5px]">
                        {TextUtil.refactorDate(
                          projectDetails?.projectDto?.startDate
                        )}
                      </div>
                      <div>and ends on</div>
                      <div className="font-semibold pl-[5px]">
                        {TextUtil.refactorDate(
                          projectDetails?.projectDto?.endDate
                        )}
                      </div>
                      <div>.</div>
                    </div>
                  </ModalText>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-x-2 w-1/2">
                      <div className="w-[270px]">
                        <Label>Start date</Label>
                        <Controller
                          name="startDate"
                          defaultValue=""
                          control={control}
                          rules={{
                            required: "Start date is required!",
                            validate: (value) => {
                              if (!value) {
                                return "Start date is required!";
                              }
                            },
                          }}
                          render={({ field }) => (
                            <Datepicker
                              defaultDate={new Date(Date.now())}
                              minDate={
                                new Date(
                                  projectDetails?.projectDto?.startDate ||
                                    Date.now()
                                )
                              }
                              maxDate={
                                new Date(
                                  projectDetails?.projectDto?.endDate ||
                                    Date.now()
                                )
                              }
                              {...field}
                              placeholder="Select start date."
                              onSelectedDateChanged={(date) =>
                                field.onChange(TextUtil.formatFormDate(date))
                              }
                            />
                          )}
                        />
                        <CustomModalError error={errors.startDate?.message} />
                      </div>
                      <div className="w-[270px]">
                        <Label>End date</Label>
                        <Controller
                          name="endDate"
                          defaultValue=""
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
                          render={({ field }) => (
                            <Datepicker
                              defaultDate={new Date(Date.now())}
                              minDate={
                                new Date(
                                  projectDetails?.projectDto?.startDate ||
                                    Date.now()
                                )
                              }
                              maxDate={
                                new Date(
                                  projectDetails?.projectDto?.endDate ||
                                    Date.now()
                                )
                              }
                              {...field}
                              placeholder="Select end date."
                              onSelectedDateChanged={(date) =>
                                field.onChange(TextUtil.formatFormDate(date))
                              }
                            />
                          )}
                        />
                        <CustomModalError error={errors.endDate?.message} />
                      </div>
                    </div>
                    <div className="flex w-1/2 justify-center">
                      <div>
                        <Label>Person months</Label>
                        <TextInput
                          type="number"
                          className="w-[270px]"
                          min={0}
                          step="0.01"
                          {...register("personMonths", {
                            required: "Person months can not be empty.",
                          })}
                        />
                        <CustomModalError
                          error={errors.personMonths?.message}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {userSalary && userOccupancy && watchPerson?.id && (
                  <>
                    <ModalDivider>user details</ModalDivider>
                    <div>
                      <div className="grid grid-cols-1 pt-8 pb-4">
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            CURRENT MONTHLY SALARY [€]
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-solid border-gray-200 bg-white divide-y divide-solid divide-gray-200">
                        <div className="grid grid-cols-1 py-6">
                          <div className="flex items-center justify-center text-sm font-semibold text-black">
                            {userSalary.amount ? userSalary.amount : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="grid grid-cols-3 pt-8 pb-4">
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            PROJECT MONTH
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            ESTIMATED PM ACROSS ALL PROJECTS
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            MAX AVAILABILITY PERCENTAGE
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-solid border-gray-200 bg-white divide-y divide-solid divide-gray-200 overflow-y-scroll h-[210px]">
                        {userOccupancy.length > 0 ? (
                          userOccupancy.map((occupancy, index) => (
                            <div className="grid grid-cols-3 py-6" key={index}>
                              <div className="flex items-center justify-center text-sm font-semibold text-black">
                                {occupancy.month
                                  ? TextUtil.refactorDate(occupancy.month)
                                  : "N/A"}
                              </div>
                              <div className="flex items-center justify-center text-sm font-semibold text-black">
                                {occupancy.estimatedPm
                                  ? occupancy.estimatedPm
                                  : "N/A"}
                              </div>
                              <div className="flex items-center justify-center text-sm font-semibold text-black">
                                {occupancy.maxAvailability
                                  ? occupancy.maxAvailability * 100
                                  : "N/A"}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full items-center justify-center flex">
                            <p className="text-muted">
                              There is currently no data to display, because
                              this user has not been assigned to any projects
                              yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </CustomModalBody>
            <CustomModalFooter>assign</CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

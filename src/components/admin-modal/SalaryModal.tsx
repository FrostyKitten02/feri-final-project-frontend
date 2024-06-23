import { useState, useEffect, useMemo } from "react";
import { CreateSalaryRequest, PersonDto } from "../../../temp_ts";
import { SalaryModalProps } from "../../interfaces";
import { personAPI, salaryApi } from "../../util/ApiDeclarations";
import { useRequestArgs } from "../../util/CustomHooks";
import { toastError, toastSuccess } from "../toast-modals/ToastFunctions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SalaryFormFields } from "../../types/forms/formTypes";
import { Label, Datepicker, TextInput } from "flowbite-react";
import TextUtil from "../../util/TextUtil";
import {
  CustomModal,
  CustomModalHeader,
  ModalTitle,
  ModalText,
  CustomModalBody,
  CustomModalError,
  ModalDivider,
  CustomModalFooter,
} from "../template/modal/CustomModal";
import UserSearchInput from "../template/search-user/UserSearchInput";
import { FaEuroSign } from "react-icons/fa6";

export default function SalaryModal({ setModalOpen }: SalaryModalProps) {
  const [allPeople, setAllPeople] = useState<PersonDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [listOpen, setListOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();

  useEffect(() => {
    fetchAllPeople();
  }, []);

  const fetchAllPeople = async (): Promise<void> => {
    try {
      const response = await personAPI.getAllPeople(requestArgs);
      if (response.status === 200) setAllPeople(response.data);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const filteredPeople = useMemo((): PersonDto[] => {
    if (searchQuery.trim() === "") {
      setListOpen(false);
      return [];
    } else {
      setListOpen(true);
      return allPeople.filter((person) =>
        `${person.name} ${person.lastname} ${person.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
  }, [searchQuery, allPeople]);

  const handleSelectPerson = (person: PersonDto): void => {
    setValue("personId", person);
    if (person.name && person.lastname) {
      setInputValue(`${person.name} ${person.lastname}`);
    } else {
      setInputValue(`${person.email}`);
    }
    setSearchQuery("");
    setListOpen(false);
  };

  const handleClose = (): void => {
    reset();
    setSearchQuery("");
    setInputValue("");
    setModalOpen(false);
  };

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm<SalaryFormFields>();
  const watchStartDate = watch("startDate");

  const onSubmit: SubmitHandler<SalaryFormFields> = async (
    data
  ): Promise<void> => {
    const salary: CreateSalaryRequest = {
      personId: data.personId.id,
      amount: data.amount,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    try {
      const response = await salaryApi.createSalaryForPerson(
        salary,
        requestArgs
      );
      if (response.status === 201) {
        handleClose();
        toastSuccess(
          "Salary of " +
            data.amount +
            "€" +
            " was succesfully set for " +
            data.personId.name +
            " " +
            data.personId.lastname
        );
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <CustomModal closeModal={handleClose} modalWidth="700px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomModalHeader handleModalOpen={handleClose}>
          <ModalTitle>set salary for user</ModalTitle>
          <ModalText
            showInfoIcon={true}
            showWarningIcon={false}
            contentColor="muted"
          >
            Information provided in the form can be changed later on.
          </ModalText>
        </CustomModalHeader>
        <CustomModalBody>
          <div>
            <Label>Select employee</Label>
            <Controller
              control={control}
              rules={{
                required: "Field can not be empty! Please select an employee.",
                validate: (value) => {
                  if (!value) {
                    ("Field can not be empty! Please select an employee.");
                  }
                  return true;
                },
              }}
              name="personId"
              render={({ field }) => (
                <UserSearchInput<SalaryFormFields, "personId">
                  setListOpen={setListOpen}
                  field={field}
                  setInputValue={setInputValue}
                  setSearchQuery={setSearchQuery}
                  inputValue={inputValue}
                  listOpen={listOpen}
                  filteredPeople={filteredPeople}
                  handleSelectPerson={handleSelectPerson}
                />
              )}
            />
            <CustomModalError error={errors.personId?.message} />
          </div>
          <ModalDivider>salary details</ModalDivider>
          <div className="flex flex-row justify-between">
            <div>
              <Label>Start date</Label>
              <Controller
                name="startDate"
                defaultValue={""}
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
                    className="w-[270px]"
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
            <div>
              <Label>End date</Label>
              <Controller
                name="endDate"
                defaultValue={""}
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
                    className="w-[270px]"
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
          <div className="pt-6">
            <Label>Amount</Label>
            <TextInput
              type="number"
              min={0}
              className="w-[270px]"
              {...register("amount", {
                required: "Salary amount can not be empty!",
              })}
              rightIcon={FaEuroSign}
            />
            <CustomModalError error={errors.amount?.message} />
          </div>
        </CustomModalBody>
        <CustomModalFooter>confirm</CustomModalFooter>
      </form>
    </CustomModal>
  );
}

import { useState, useEffect, useMemo } from "react";
import { CreatePersonTypeRequest, PersonDto } from "../../../temp_ts";
import {
  CustomModal,
  CustomModalBody,
  CustomModalError,
  CustomModalFooter,
  CustomModalHeader,
  ModalDivider,
  ModalText,
  ModalTitle,
} from "../../components/template/modal/CustomModal";
import { useRequestArgs } from "../../util/CustomHooks";
import { personAPI, personTypeAPI } from "../../util/ApiDeclarations";
import { toastError, toastSuccess } from "../toast-modals/ToastFunctions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PersonTypeFormFields } from "../../types/forms/formTypes";
import { PersonTypeModalProps } from "../../interfaces";
import { Datepicker, Label, TextInput } from "flowbite-react";
import UserSearchInput from "../template/search-user/UserSearchInput";
import { FaPercent } from "react-icons/fa6";
import TextUtil from "../../util/TextUtil";

export default function PersonTypeModal({
  setModalOpen,
}: PersonTypeModalProps) {
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
  } = useForm<PersonTypeFormFields>();
  const watchStartDate = watch("startDate");

  const onSubmit: SubmitHandler<PersonTypeFormFields> = async (
    data
  ): Promise<void> => {
    const personType: CreatePersonTypeRequest = {
      name: data.name,
      research: data.research / 100,
      educate: data.educate / 100,
      startDate: data.startDate,
      endDate: data.endDate,
      personId: data.personId.id,
    };

    try {
      const response = await personTypeAPI.createPersonType(
        personType,
        requestArgs
      );
      if (response.status === 201) {
        handleClose();
        toastSuccess(
          data.name +
            " was successfully assigned to " +
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
    <CustomModal closeModal={() => setModalOpen(false)} modalWidth="700px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomModalHeader handleModalOpen={() => setModalOpen(false)}>
          <ModalTitle>set employment type for user</ModalTitle>
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
                <UserSearchInput<PersonTypeFormFields, "personId">
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
          <ModalDivider>employment details</ModalDivider>
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
            <Label>Name</Label>
            <TextInput
              type="text"
              className="w-[270px]"
              {...register("name", { required: "Name can not be empty!" })}
            />
            <CustomModalError error={errors.name?.message} />
          </div>
          <div className="flex flex-row justify-between pt-6">
            <div>
              <Label>Research</Label>
              <TextInput
                type="number"
                min={0}
                max={100}
                className="w-[270px]"
                {...register("research", {
                  required: "Research can not be empty!",
                })}
                rightIcon={FaPercent}
              />
              <CustomModalError error={errors.research?.message} />
            </div>
            <div>
              <Label>Educate</Label>
              <TextInput
                type="number"
                min={0}
                max={100}
                className="w-[270px]"
                {...register("educate", {
                  required: "Educate can not be empty!",
                })}
                rightIcon={FaPercent}
              />
              <CustomModalError error={errors.educate?.message} />
            </div>
          </div>
        </CustomModalBody>
        <CustomModalFooter>confirm</CustomModalFooter>
      </form>
    </CustomModal>
  );
}

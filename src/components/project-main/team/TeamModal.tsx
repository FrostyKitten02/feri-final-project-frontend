import { useEffect, useMemo, useRef, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import {
  CustomModal,
  CustomModalError,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { AddPersonToProjectRequest, PersonDto } from "../../../../temp_ts";
import {
  CustomModalBody,
  CustomModalFooter,
} from "../../template/modal/CustomModal";
import { Label } from "flowbite-react";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import { TextInput } from "flowbite-react";
import { personAPI, projectAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { IoSearch } from "react-icons/io5";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AssignPersonFormFields } from "../../../types/forms/formTypes";
import { useParams } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { TeamModalProps } from "../../../interfaces";

export default function TeamModal({ handleAddPerson }: TeamModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allPeople, setAllPeople] = useState<PersonDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [listOpen, setListOpen] = useState<boolean>(false);

  const requestArgs = useRequestArgs();
  const { projectId } = useParams();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllPeople();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setListOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listRef]);

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

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<AssignPersonFormFields>();

  const handleSelectPerson = (person: PersonDto): void => {
    setValue("person", person);
    if (person.name && person.lastname) {
      setInputValue(`${person.name} ${person.lastname}`);
    } else {
      setInputValue(`${person.email}`);
    }
    setSearchQuery("");
    setListOpen(false);
  };

  const handleClose = (): void => {
    reset({ person: undefined });
    setSearchQuery("");
    setInputValue("");
    setModalOpen(false);
  };

  const onSubmit: SubmitHandler<AssignPersonFormFields> = async (
    data
  ): Promise<void> => {
    const person: AddPersonToProjectRequest = {
      personId: data.person.id,
    };

    try {
      if (projectId) {
        const response = await projectAPI.addPersonToProject(
          projectId,
          person,
          requestArgs
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
        toastError("Project id not found.");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        <BsPersonAdd className="fill-black size-12 hover:fill-primary transition delay-50" />
      </button>
      {modalOpen && (
        <CustomModal closeModal={handleClose} modalWidth="950px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomModalHeader handleModalOpen={handleClose}>
              <ModalTitle>Assign person to project</ModalTitle>
              <ModalText
                showInfoIcon={false}
                showWarningIcon={true}
                contentColor="warning"
              >
                Only available employees can be assigned to the project.
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
                      if (!value) {
                        ("Field can not be empty! Please select an employee.");
                      }
                      return true;
                    },
                  }}
                  name="person"
                  render={({ field }) => (
                    <>
                      <TextInput
                        className="w-[700px]"
                        placeholder="Search employee"
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setSearchQuery(e.target.value);
                          field.onChange(e);
                        }}
                        value={inputValue}
                        icon={IoSearch}
                      />
                      {listOpen && (
                        <div className="relative w-[700px]" ref={listRef}>
                          <div className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto rounded-lg">
                            {filteredPeople.slice(0, 5).map((person) => (
                              <div
                                key={person.id}
                                className="grid grid-cols-[40px_1fr_1fr] py-2 px-2 hover:bg-gray-200 font-semibold text-sm cursor-pointer items-center border-solid border-b border-gray-200"
                                onClick={() => {
                                  handleSelectPerson(person);
                                }}
                              >
                                <div className="flex justify-center">
                                  <IoPersonCircle className="size-6 fill-black" />
                                </div>
                                <div className="flex justify-center">
                                  {person.name && person.lastname ? (
                                    <p>
                                      {person.name} {person.lastname}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="flex justify-center">
                                  <p>{person.email}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
                <CustomModalError error={errors.person?.message} />
              </div>
            </CustomModalBody>
            <CustomModalFooter>assign</CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

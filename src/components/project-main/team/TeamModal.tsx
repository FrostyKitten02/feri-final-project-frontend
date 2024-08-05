import { useEffect, useMemo, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import {
  CustomModal,
  CustomModalError,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import {
  AddPersonToProjectRequest,
  ListPersonResponse,
  PageInfoRequest,
  PersonDto,
  PersonListSearchParams,
  PersonSortInfoRequest,
} from "../../../../temp_ts";
import {
  CustomModalBody,
  CustomModalFooter,
} from "../../template/modal/CustomModal";
import { Label } from "flowbite-react";
import { toastError, toastSuccess } from "../../toast-modals/ToastFunctions";
import { personAPI, projectAPI } from "../../../util/ApiDeclarations";
import { useRequestArgs } from "../../../util/CustomHooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AssignPersonFormFields } from "../../../types/types";
import { useParams } from "react-router-dom";
import { TeamModalProps } from "../../../interfaces";
import UserSearchInput from "../../template/search-user/UserSearchInput";

export default function TeamModal({ handleAddPerson }: TeamModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allPeople, setAllPeople] = useState<ListPersonResponse>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState<string>(searchQuery);
  const [inputValue, setInputValue] = useState<string>("");
  const [listOpen, setListOpen] = useState<boolean>(false);

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
      elementsPerPage: 3,
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
        requestArgs
      );
      if (response.status === 200) setAllPeople(response.data);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const filteredPeople = useMemo((): PersonDto[] => {
    if (debouncedSearchQuery.trim() === "") {
      setListOpen(false);
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
    reset();
    setSearchQuery("");
    setInputValue("");
    setModalOpen(false);
  };

  const resetField = (): void => {
    reset();
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
            <CustomModalHeader handleModalClose={handleClose}>
              <ModalTitle>Assign person to project</ModalTitle>
              <ModalText showIcon={true} contentColor="warning">
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
            </CustomModalBody>
            <CustomModalFooter>assign</CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

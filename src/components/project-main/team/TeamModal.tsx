import { useEffect, useMemo, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import {
  CustomModal,
  CustomModalError,
  CustomModalHeader,
  ModalDivider,
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
  SalaryDto,
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
import { motion } from "framer-motion";

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
    setListOpen(false);

    const fetchSalaryforUser = async (): Promise<void> => {
      if (!person.id) return;
      try {
        const response = await personAPI.getPersonById(person?.id, requestArgs);
        if (response.status === 200) {
          setUserSalary({
            ...userSalary,
            amount: response.data.currentSalary?.amount,
          });
        }
      } catch (error: any) {
        toastError(error.message);
      }
    };
    fetchSalaryforUser();
  };

  const handleClose = (): void => {
    reset();
    setSearchQuery("");
    setInputValue("");
    setUserSalary({ ...userSalary, amount: undefined });
    setModalOpen(false);
  };

  const resetField = (): void => {
    reset();

    setUserSalary({ ...userSalary, amount: undefined });
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
        <BsPersonAdd className="fill-black size-12 transition delay-50" />
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
              {userSalary.amount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ModalDivider>user details</ModalDivider>
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
                        {userSalary.amount}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CustomModalBody>
            <CustomModalFooter>assign</CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { ManageUsersModalProps, PopoverItem } from "../../interfaces";
import { motion } from "framer-motion";
import { FaUsersCog } from "react-icons/fa";
import {
  CustomModal,
  CustomModalBody,
  CustomModalHeader,
  ModalTitle,
} from "../template/modal/CustomModal";
import { toastError } from "../toast-modals/ToastFunctions";
import { personAPI } from "../../util/ApiDeclarations";
import {
  ListPersonResponse,
  PageInfoRequest,
  PersonListSearchParams,
  PersonSortInfoRequest,
} from "../../../temp_ts";
import { useRequestArgs } from "../../util/CustomHooks";
import { CustomPagination } from "../template/pagination/CustomPagination";
import UserSearchInput from "../template/search-user/UserSearchInput";
import Popover from "../template/popover-menu/Popover";
import SalaryModal from "./SalaryModal";
import PersonTypeModal from "./PersonTypeModal";
import SalaryEmploymentHistoryModal from "./SalaryEmploymentHistoryModal";
import { BsThreeDots } from "react-icons/bs";
import { Spinner } from "flowbite-react";

export default function ManageUsersModal({
  sidebarOpened,
}: ManageUsersModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<ListPersonResponse>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [userUpdated, setUserUpdated] = useState<boolean>(false);
  const [elementsPerPage] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState<string>(searchQuery);
  const [loading, setLoading] = useState<boolean>(true);

  const requestArgs = useRequestArgs();

  useEffect(() => {
    if (modalOpen) {
      setLoading(true);
      fetchAllUsers(pageNumber, elementsPerPage);
    }
    if (userUpdated) {
      setUserUpdated(false);
    }
  }, [modalOpen, pageNumber, userUpdated, debouncedSearchQuery]);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const onPageChange = (page: number) => {
    setPageNumber(page);
  };

  const refetchUserList = (): void => {
    setUserUpdated(true);
  };

  const handleClose = (): void => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setModalOpen(false);
  };

  const fetchAllUsers = async (
    pageNum: number,
    elementsNum: number
  ): Promise<void> => {
    const pageInfo: PageInfoRequest = {
      elementsPerPage: elementsNum,
      pageNumber: pageNum,
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
      if (response.status === 200) {
        setAllUsers(response.data);
        if (
          response.data.pageInfo &&
          response.data.pageInfo.totalElements &&
          response.data.pageInfo.elementsPerPage
        ) {
          const newTotalPages = Math.ceil(
            response.data.pageInfo.totalElements /
              response.data.pageInfo.elementsPerPage
          );
          setTotalPages(newTotalPages);
          setPageNumber(pageNum);
        }
      }
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex flex-row justify-center items-center gap-x-3"
      >
        <FaUsersCog className="fill-white size-7" />
        {sidebarOpened && (
          <motion.span
            initial={{ visibility: "hidden", opacity: 0 }}
            animate={{ visibility: "visible", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-semibold"
          >
            MANAGE USERS
          </motion.span>
        )}
      </button>
      {modalOpen && (
        <CustomModal closeModal={handleClose} modalWidth="1500px">
          <CustomModalHeader handleModalOpen={handleClose}>
            <ModalTitle>manage users</ModalTitle>
          </CustomModalHeader>
          <CustomModalBody>
            <div className="flex flex-col">
              <div className="flex justify-end">
                <div className="flex flex-col items-end w-[400px]">
                  <UserSearchInput
                    showResults={true}
                    inputWidth={250}
                    setSearchQuery={setSearchQuery}
                    inputValue={searchQuery}
                  />
                </div>
              </div>
              <div className="w-full h-[400px]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="xl" />
                  </div>
                ) : (allUsers?.people?.length ?? 0) > 0 ? (
                  <>
                    <div className="grid grid-cols-5 pt-8 pb-4">
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          NAME
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          EMAIL ADDRESS
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          SALARY [€]
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          AVAILABILITY PERCENTAGE
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          ACTION
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-solid border-gray-200 overflow-visible bg-white divide-y divide-solid divide-gray-200">
                      {allUsers?.people?.map((user, index) => {
                        const popoverItems: PopoverItem[] = [
                          {
                            component: (
                              <SalaryModal
                                userId={user.id}
                                userEmail={user.email}
                                refetchUserList={refetchUserList}
                              />
                            ),
                          },
                          {
                            component: (
                              <PersonTypeModal
                                userId={user.id}
                                userEmail={user.email}
                                refetchUserList={refetchUserList}
                              />
                            ),
                          },
                          {
                            component: (
                              <SalaryEmploymentHistoryModal
                                userId={user.id}
                                userEmail={user.email}
                                refetchUserList={refetchUserList}
                              />
                            ),
                          },
                        ];

                        return (
                          <div
                            className={`grid grid-cols-5 py-6 ${
                              index === 0 ? `rounded-t-xl` : ""
                            } ${
                              index === (allUsers.people?.length ?? 0) - 1
                                ? `rounded-b-xl`
                                : ""
                            }`}
                            key={user.id}
                          >
                            <div className="flex items-center justify-center text-sm font-semibold">
                              <div>
                                {user.name && user.lastname ? (
                                  <p>
                                    {user.name} {user.lastname}
                                  </p>
                                ) : (
                                  <p>N/A</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-center text-sm font-normal text-gray-500">
                              {user.email}
                            </div>
                            <div className="flex items-center justify-center font-semibold">
                              {user.salary ? user.salary : "N/A"}
                            </div>
                            <div className="flex items-center justify-center">
                              {user.availability
                                ? user.availability * 100
                                : "N/A"}
                            </div>
                            <div className="flex items-center justify-center relative">
                              <Popover
                                height={36}
                                items={popoverItems}
                                triggerIcon={
                                  <BsThreeDots className="size-6 fill-gray-700 hover:fill-primary transition delay-50" />
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center gap-y-4">
                    <p className="text-2xl font-semibold">No users found.</p>
                    <p className="text-lg text-gray-500">
                      "{searchQuery}" does not match any users in the database.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 rounded-xl border-solid border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition delay-50"
                    >
                      <span className="font-semibold">Clear search</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-center pt-8">
                <CustomPagination
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  currentPage={pageNumber}
                  backLabelText=""
                  nextLabelText=""
                />
              </div>
            </div>
          </CustomModalBody>
        </CustomModal>
      )}
    </>
  );
}

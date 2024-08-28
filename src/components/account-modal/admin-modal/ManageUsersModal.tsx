import { useEffect, useState } from "react";
import { ManageUsersModalProps, PopoverItem } from "../../../interfaces";
import { FaHistory } from "react-icons/fa";
import {
  CustomModal,
  CustomModalBody,
  CustomModalHeader,
  ModalText,
  ModalTitle,
} from "../../template/modal/CustomModal";
import { personAPI } from "../../../util/ApiDeclarations";
import {
  ListPersonResponse,
  PageInfoRequest,
  PersonListSearchParams,
  PersonSortInfoRequest,
} from "../../../../client";
import { useUserImageLoader, useRequestArgs } from "../../../util/CustomHooks";
import { CustomPagination } from "../../template/pagination/CustomPagination";
import UserSearchInput from "../../template/search-user/UserSearchInput";
import Popover from "../../template/popover-menu/Popover";
import SalaryModal from "./SalaryModal";
import PersonTypeModal from "./PersonTypeModal";
import SalaryEmploymentHistoryModal from "./SalaryEmploymentHistoryModal";
import { BsFillPersonVcardFill, BsThreeDots } from "react-icons/bs";
import { Spinner } from "flowbite-react";
import { FaEuroSign } from "react-icons/fa6";
import TextUtil from "../../../util/TextUtil";
import RequestUtil from "../../../util/RequestUtil";
import ClerkDefaultImg from "../../../assets/images/clerk_default_profile_img.png";

export default function ManageUsersModal({
  modalOpen,
  setModalOpen,
}: ManageUsersModalProps) {
  //const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<ListPersonResponse>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [userUpdated, setUserUpdated] = useState<boolean>(false);
  const [elementsPerPage] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState<string>(searchQuery);
  const [loading, setLoading] = useState<boolean>(true);

  const { updateImageState, userImageLoaded } = useUserImageLoader();

  const requestArgs = useRequestArgs();

  useEffect(() => {
    setLoading(true);
    fetchAllUsers(pageNumber, elementsPerPage);
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
        await requestArgs.getRequestArgs()
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
    } catch (error) {
      RequestUtil.handleAxiosRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomModal closeModal={handleClose} modalWidth="1500px">
        <CustomModalHeader handleModalClose={handleClose}>
          <ModalTitle>manage users</ModalTitle>
          <ModalText showIcon={true}>
            Manage employee information including salaries, employment types,
            and view historical changes. Use the search bar to find specific
            employees quickly. Set or update salary and availability percentage,
            and access additional actions through the menu on each row.
          </ModalText>
        </CustomModalHeader>
        <CustomModalBody>
          <div className="flex flex-col">
            <div className="flex justify-end">
              <div className="flex flex-col items-end w-[400px]">
                <UserSearchInput
                  showResults={false}
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
                        MONHTLY SALARY [€]
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
                          icon: <FaEuroSign className="size-4" />,
                          label: "Manage salary",
                        },
                        {
                          component: (
                            <PersonTypeModal
                              userId={user.id}
                              userEmail={user.email}
                              refetchUserList={refetchUserList}
                            />
                          ),
                          icon: <BsFillPersonVcardFill className="size-4" />,
                          label: "Manage employment type",
                        },
                        {
                          component: (
                            <SalaryEmploymentHistoryModal
                              userId={user.id}
                              userEmail={user.email}
                              refetchUserList={refetchUserList}
                            />
                          ),
                          icon: <FaHistory className="size-4" />,
                          label: "Salary & employment history",
                        },
                      ];

                      return (
                        <div
                          className={`grid grid-cols-5 py-6 ${
                            index === 0 ? `rounded-t-xl` : ""
                          } ${
                            index === (allUsers?.people?.length ?? 0) - 1
                              ? `rounded-b-xl`
                              : ""
                          }`}
                          key={user.id}
                        >
                          <div className="flex items-center justify-start pl-16 text-sm font-semibold gap-x-4">
                            <div>
                              {user.profileImageUrl ? (
                                <>
                                  {!userImageLoaded[user.id as string] && (
                                    <div className="rounded-full animate-pulse h-8 w-8 bg-slate-200" />
                                  )}
                                  <img
                                    src={user.profileImageUrl}
                                    className={`${
                                      userImageLoaded[user.id as string]
                                        ? "block"
                                        : "hidden"
                                    } size-8 rounded-full`}
                                    onLoad={() => updateImageState(user.id)}
                                  />
                                </>
                              ) : (
                                <img
                                  src={ClerkDefaultImg}
                                  className="size-8 rounded-full"
                                />
                              )}
                            </div>
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
                              ? TextUtil.roundDownToTwoDecimalPlaces(
                                  user.availability * 100
                                )
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
    </>
  );
}

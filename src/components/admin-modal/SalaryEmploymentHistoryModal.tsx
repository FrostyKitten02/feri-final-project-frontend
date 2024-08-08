import { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { AdminModalProps } from "../../interfaces";
import ModalPortal from "../template/modal/ModalPortal";
import {
  CustomModal,
  CustomModalBody,
  CustomModalHeader,
  ModalDivider,
  ModalText,
  ModalTitle,
} from "../template/modal/CustomModal";
import { toastError } from "../toast-modals/ToastFunctions";
import {
  PageInfoRequest,
  PersonTypeListDto,
  PersonTypeListSearchParams,
  PersonTypeListSortInfoRequest,
  SalaryListDto,
  SalaryListSearchParams,
  SalaryListSortInfoRequest,
} from "../../../temp_ts";
import { personTypeAPI, salaryApi } from "../../util/ApiDeclarations";
import { useRequestArgs } from "../../util/CustomHooks";
import { CustomPagination } from "../template/pagination/CustomPagination";
import { Spinner } from "flowbite-react";

export default function SalaryEmploymentHistoryModal({
  onButtonClick,
  onModalClose,
  setActionPopoverOpen,
  userId,
  userEmail,
}: AdminModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [totalPagesSalary, setTotalPagesSalary] = useState<number>(0);
  const [pageNumberSalary, setPageNumberSalary] = useState<number>(1);
  const [totalPagesEmployment, setTotalPagesEmployment] = useState<number>(0);
  const [pageNumberEmployment, setPageNumberEmployment] = useState<number>(1);
  const [loadingSalary, setLoadingSalary] = useState<boolean>(true);
  const [loadingEmployment, setLoadingEmployment] = useState<boolean>(true);
  const [elementsPerPage] = useState<number>(2);
  const [salaries, setSalaries] = useState<Array<SalaryListDto>>([]);
  const [employments, setEmployments] = useState<Array<PersonTypeListDto>>([]);

  const requestArgs = useRequestArgs();

  useEffect(() => {
    setLoadingSalary(true);
    if (modalOpen) {
      fetchSalaryHistory(pageNumberSalary, elementsPerPage).then(() =>
        setLoadingSalary(false)
      );
    }
  }, [modalOpen, pageNumberSalary]);

  useEffect(() => {
    setLoadingEmployment(true);
    if (modalOpen) {
      fetchEmploymentHistory(pageNumberEmployment, elementsPerPage).then(() =>
        setLoadingEmployment(false)
      );
    }
  }, [modalOpen, pageNumberEmployment]);

  const handleClose = (): void => {
    onModalClose?.();
    setModalOpen(false);
    setActionPopoverOpen?.(false);
  };

  const onSalaryPageChange = (page: number) => {
    setPageNumberSalary(page);
  };

  const onEmploymentPageChange = (page: number) => {
    setPageNumberEmployment(page);
  };

  const fetchSalaryHistory = async (
    pageNum: number,
    elementsNum: number
  ): Promise<void> => {
    const pageInfo: PageInfoRequest = {
      elementsPerPage: elementsNum,
      pageNumber: pageNum,
    };
    const sortInfo: SalaryListSortInfoRequest = {
      ascending: false,
      fields: ["START_DATE"],
    };
    const searchParams: SalaryListSearchParams = {
      forUser: userId,
    };
    try {
      const response = await salaryApi.listSalaries(
        pageInfo,
        sortInfo,
        searchParams,
        requestArgs
      );
      if (response.status === 200) {
        setSalaries(response.data.salaries ?? []);
        if (
          response.data.pageInfo &&
          response.data.pageInfo.totalElements &&
          response.data.pageInfo.elementsPerPage
        ) {
          const newTotalPages = Math.ceil(
            response.data.pageInfo.totalElements /
              response.data.pageInfo.elementsPerPage
          );
          setTotalPagesSalary(newTotalPages);
          setPageNumberSalary(pageNum);
        }
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const fetchEmploymentHistory = async (
    pageNum: number,
    elementsNum: number
  ): Promise<void> => {
    const pageInfo: PageInfoRequest = {
      elementsPerPage: elementsNum,
      pageNumber: pageNum,
    };
    const sortInfo: PersonTypeListSortInfoRequest = {
      ascending: false,
      fields: ["START_DATE"],
    };
    const searchParams: PersonTypeListSearchParams = {
      forUser: userId,
    };
    try {
      const response = await personTypeAPI.listPersonTypes(
        pageInfo,
        sortInfo,
        searchParams,
        requestArgs
      );
      if (response.status === 200) {
        setEmployments(response.data.personTypes ?? []);
        if (
          response.data.pageInfo &&
          response.data.pageInfo.totalElements &&
          response.data.pageInfo.elementsPerPage
        ) {
          const newTotalPages = Math.ceil(
            response.data.pageInfo.totalElements /
              response.data.pageInfo.elementsPerPage
          );
          setTotalPagesEmployment(newTotalPages);
          setPageNumberEmployment(pageNum);
        }
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          onButtonClick?.(), setModalOpen(true);
        }}
        className="flex flex-row items-center justify-start text-gray-500 h-full rounded-b-lg text-sm font-semibold hover:text-gray-800 fill-gray-500  hover:fill-gray-800 transition delay-50 gap-x-4 pl-4 hover:bg-gray-100"
      >
        <FaHistory className="size-4" />
        <span>Salary & employment history</span>
      </button>
      {modalOpen && (
        <ModalPortal>
          <CustomModal closeModal={handleClose} modalWidth="1000px">
            <CustomModalHeader handleModalClose={handleClose}>
              <ModalTitle>salary and employment history</ModalTitle>
              <ModalText showIcon={false} contentColor="muted">
                <div className="flex items-center text-black text-md">
                  <div>You are viewing salary and employment history of</div>
                  <div className="font-semibold pl-[5px]">{userEmail}</div>
                  <div>.</div>
                </div>
              </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
              <ModalDivider paddingTop="0px">salary history</ModalDivider>
              <div className="flex flex-col">
                <div className="w-full">
                  {loadingSalary ? (
                    <div className="flex justify-center items-center h-full">
                      <Spinner size="xl" />
                    </div>
                  ) : salaries.length > 0 ? (
                    <>
                      <div className="grid grid-cols-3 pt-8 pb-4">
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            SALARY AMOUNT [€]
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            START DATE
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            END DATE
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-solid border-gray-200 overflow-visible bg-white divide-y divide-solid divide-gray-200">
                        {salaries.map((salary, index) => (
                          <div
                            className={`grid grid-cols-3 py-6 ${
                              index === 0 ? `rounded-t-xl` : ""
                            } ${
                              index === salaries.length - 1
                                ? `rounded-b-xl`
                                : ""
                            }`}
                            key={index}
                          >
                            <div className="flex items-center justify-center font-semibold">
                              {salary.amount}
                            </div>
                            <div className="flex items-center justify-center font-semibold">
                              {salary.startDate}
                            </div>
                            <div className="flex items-center justify-center font-semibold">
                              {salary.endDate ? salary.endDate : `N/A`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center">
                      <p className="text-lg font-semibold">
                        This user does not have a salary history.
                      </p>
                    </div>
                  )}
                </div>
                {salaries.length > 0 && (
                  <div className="flex justify-center pt-8">
                    <CustomPagination
                      totalPages={totalPagesSalary}
                      onPageChange={onSalaryPageChange}
                      currentPage={pageNumberSalary}
                      backLabelText=""
                      nextLabelText=""
                    />
                  </div>
                )}
              </div>
              <ModalDivider>employment history</ModalDivider>
              <div className="flex flex-col">
                <div className="w-full">
                  {loadingEmployment ? (
                    <div className="flex justify-center items-center h-full">
                      <Spinner size="xl" />
                    </div>
                  ) : employments.length > 0 ? (
                    <>
                      <div className="grid grid-cols-4 pt-8 pb-4">
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            NAME
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold text-center">
                            AVAILABILITY PERCENTAGE (RESEARCH / EDUCATE)
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            START DATE
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                          <div className="text-sm text-gray-600 font-semibold">
                            END DATE
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-solid border-gray-200 overflow-visible bg-white divide-y divide-solid divide-gray-200">
                        {employments.map((employment, index) => (
                          <div
                            className={`grid grid-cols-4 py-6 ${
                              index === 0 ? `rounded-t-xl` : ""
                            } ${
                              index === salaries.length - 1
                                ? `rounded-b-xl`
                                : ""
                            }`}
                            key={employment.id}
                          >
                            <div className="flex items-center justify-center font-normal text-gray-500">
                              {employment.name}
                            </div>
                            <div className="flex items-center justify-center font-semibold">
                              {(employment.maxAvailability ?? 0) * 100} (
                              {(employment.research ?? 0) * 100} /{" "}
                              {(employment.educate ?? 0) * 100})
                            </div>
                            <div className="flex items-center justify-center font-semibold">
                              {employment.startDate}
                            </div>
                            <div className="flex items-center justify-center font-semibold">
                              {employment.endDate ? employment.endDate : `N/A`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center">
                      <p className="text-lg font-semibold">
                        This user does not have an employment history.
                      </p>
                    </div>
                  )}
                </div>
                {employments.length > 0 && (
                  <div className="flex justify-center pt-8">
                    <CustomPagination
                      totalPages={totalPagesEmployment}
                      onPageChange={onEmploymentPageChange}
                      currentPage={pageNumberEmployment}
                      backLabelText=""
                      nextLabelText=""
                    />
                  </div>
                )}
              </div>
            </CustomModalBody>
          </CustomModal>
        </ModalPortal>
      )}
    </>
  );
}

import {CustomPaginationProps} from "../../../interfaces";
import {MdNavigateNext} from "react-icons/md";
import {MdChevronLeft} from "react-icons/md";
import TextUtil from "../../../util/TextUtil";

export const CustomPagination = ({
                                     currentPage,
                                     onPageChange,
                                     totalPages,
                                     backLabelText,
                                     nextLabelText
                                 }: CustomPaginationProps) => {
    const pageNumbers = TextUtil.getPageNumbers(currentPage, Math.ceil(totalPages));
    const allPages = Math.ceil(totalPages);
    return (
        <div className="flex flex-row items-center space-x-2">
            <button
                className={`${currentPage === 1 ? "text-placeholder" : "hover:bg-gray-100 delay-50 transition"} flex py-1 items-center px-4 rounded-lg`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <MdChevronLeft/>
                <span className="uppercase">
                   {backLabelText ?? "previous page"}
                </span>
            </button>
            <div className="space-x-2">
                {
                    pageNumbers.map(pageNumber => {
                        return (
                            <button
                                key={pageNumber}
                                className={`${pageNumber === currentPage ? "bg-c-sky bg-opacity-10 text-primary" : "hover:bg-gray-100"} px-3 py-1 rounded-lg delay-50 transition`}
                                onClick={() => onPageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        )
                    })
                }
            </div>
            <button
                className={`${currentPage === allPages ? "text-placeholder" : "hover:bg-gray-100 delay-50 transition"} flex items-center px-4 py-1 rounded-lg`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === allPages}
            >
                <span className="uppercase">
                    {nextLabelText ?? "next page"}
                </span>
                <MdNavigateNext/>
            </button>
        </div>
    )
}
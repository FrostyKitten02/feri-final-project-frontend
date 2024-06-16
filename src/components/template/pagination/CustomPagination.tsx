import {CustomPaginationProps} from "../../../interfaces";
import {MdNavigateNext} from "react-icons/md";
import {MdChevronLeft} from "react-icons/md";

export const CustomPagination = ({currentPage, onPageChange, totalPages}: CustomPaginationProps) => {
    const getPageNumbers = () => {
        const shownPages = 5;
        const pages: number[] = [];

        let startPage = Math.max(currentPage - Math.floor(shownPages / 2), 1);
        let endPage = startPage + shownPages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - shownPages + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    return (
        <div className="flex flex-row items-center space-x-2">
            <button className={`${currentPage === 1 ? "text-placeholder" : "hover:bg-gray-200 delay-50 transition"} flex py-1 items-center px-4 rounded-lg`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
            >
                <MdChevronLeft/>
                <span className="uppercase font-mono">
                   previous page
                </span>
            </button>
            <div className="space-x-2">
                {
                    pageNumbers.map(pageNumber => {
                        return (
                            <button
                                className={`${pageNumber === currentPage && "bg-blue-200 text-primary"} px-3 py-1 rounded-lg font-mono delay-50 transition hover:bg-gray-200`}
                                onClick={() => onPageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        )
                    })
                }
            </div>
            <button className={`${currentPage === totalPages ? "text-placeholder" : "hover:bg-gray-200 delay-50 transition"} flex items-center px-4 py-1 rounded-lg`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
            >
                <span className="uppercase font-mono">
                    next page
                </span>
                <MdNavigateNext/>
            </button>
        </div>
    )
}
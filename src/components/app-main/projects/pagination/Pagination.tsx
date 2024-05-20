import RightChevron from "../../../../assets/all-projects/right-chevron-svgrepo-com.svg?react";
import LeftChevron from "../../../../assets/all-projects/left-chevron-svgrepo-com.svg?react";

interface PaginationProps {
  pageNumber: number;
  lastPage: boolean;
  totalPages: number;
  onPageChange: (pageNum: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export default function Pagination(props: PaginationProps) {
  const pagesArray = [];

  for (let i = 1; i <= props.totalPages; i++) {
    // loop through the total number of pages and push them to the array
    pagesArray.push(i);
  }

  return (
    <div className="flex flex-row">
      <div className="flex w-1/3 justify-start font-semibold">
        {props.pageNumber !== 1 && (
          <button onClick={props.prevPage}>
            <div className="flex flex-row">
              <LeftChevron className="size-6 fill-gray-700" />
              <p>Previous page</p>
            </div>
          </button>
        )}
      </div>
      <div className="flex w-1/3 justify-center">
        {/*<p className="font-semibold text-gray-700">Page {props.pageNumber}</p>*/}
        {pagesArray.map((page) => (
          <div className="flex flex-row px-2" key={page}>
            <button onClick={() => props.onPageChange(page)}>{page}</button>
          </div>
        ))}
      </div>
      <div className="flex w-1/3 justify-end font-semibold">
        {!props.lastPage && (
          <div>
            <button onClick={props.nextPage}>
              <div className="flex flex-row">
                <p>Next page</p>
                <RightChevron className="size-6 fill-gray-700" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

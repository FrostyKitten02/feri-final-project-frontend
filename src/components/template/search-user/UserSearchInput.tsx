import { TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import { IoPersonCircle } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { UserSearchInputProps } from "../../../interfaces";
import { GrSearch } from "react-icons/gr";
import { MdClear } from "react-icons/md";

export default function UserSearchInput<
  T extends FieldValues,
  K extends Path<T>
>({
  setListOpen,
  field,
  setInputValue,
  setSearchQuery,
  inputValue,
  listOpen,
  filteredPeople,
  handleSelectPerson,
  inputWidth,
  showResults,
}: UserSearchInputProps<T, K>) {
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setListOpen?.(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listRef]);

  return (
    <>
      <TextInput
        addon={
          <div className="h-full -mx-3 w-12 flex items-center justify-center">
            <button
              className="flex w-full h-full items-center justify-center"
              type="button"
              onClick={() => {
                setSearchQuery(""), setInputValue?.(""), setQuery("");
              }}
            >
              <MdClear className="size-6 stroke-black" />
            </button>
          </div>
        }
        style={{ width: `${inputWidth}px` }}
        className="pb-2"
        placeholder="Search for an employee"
        onChange={(e) => {
          setInputValue?.(e.target.value);
          setQuery(e.target.value);
          setSearchQuery(e.target.value);
          field?.onChange(e);
        }}
        value={inputValue}
        icon={IoSearch}
      />
      {listOpen && showResults && (
        <div
          className="relative w-full"
          style={{ width: `${inputWidth && inputWidth + 48}px` }}
          ref={listRef}
        >
          <div className="absolute z-10 w-full shadow-lg bg-white max-h-70 overflow-auto rounded-lg border border-solid border-gray-200">
            <div className="flex flex-row items-center gap-x-2 py-2 px-4 ">
              <GrSearch className="size-6 stroke-black" />
              <p className="font-semibold text-lg">Search for "{query}"</p>
            </div>
            {(filteredPeople?.length ?? 0) > 0 && (
              <>
                <div className="py-2 px-4 font-semibold text-lg">Results</div>
                <div className="divide-y">
                  {filteredPeople?.map((person) => (
                    <div
                      key={person.id}
                      className="grid grid-cols-[40px_1fr_1fr] py-2 px-2 hover:bg-gray-200 font-semibold text-sm cursor-pointer items-center border-solid border-gray-200"
                      onClick={() => {
                        handleSelectPerson?.(person);
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

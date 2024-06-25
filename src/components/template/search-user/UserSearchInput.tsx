import { TextInput } from "flowbite-react";
import { useEffect, useRef } from "react";
import { FieldValues, Path } from "react-hook-form";
import { IoPersonCircle } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { UserSearchInputProps } from "../../../interfaces";

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
}: UserSearchInputProps<T, K>) {
  const listRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <TextInput
        style={{ width: `${inputWidth}px` }}
        className="pb-2"
        placeholder="Search employee"
        onChange={(e) => {
          setInputValue(e.target.value);
          setSearchQuery(e.target.value);
          field.onChange(e);
        }}
        value={inputValue}
        icon={IoSearch}
      />
      {listOpen && filteredPeople.length > 0 && (
        <div
          className="relative"
          style={{ width: `${inputWidth}px` }}
          ref={listRef}
        >
          <div className="absolute z-10 w-full shadow-lg bg-white max-h-70 overflow-auto rounded-lg border border-solid border-gray-200">
            <div className="py-2 px-4 font-semibold text-lg">Results</div>
            <div className="divide-y">
              {filteredPeople.slice(0, 5).map((person) => (
                <div
                  key={person.id}
                  className="grid grid-cols-[40px_1fr_1fr] py-2 px-2 hover:bg-gray-200 font-semibold text-sm cursor-pointer items-center border-solid border-gray-200"
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
        </div>
      )}
    </>
  );
}

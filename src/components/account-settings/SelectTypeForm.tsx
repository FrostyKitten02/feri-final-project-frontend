import { useState } from "react";
import { SelectTypeFormProps } from "../../interfaces";
import { SelectTypeFormFields } from "../../types/forms/formTypes";
import { useForm } from "react-hook-form";

export default function SelectTypeForm({
  /*onSubmit,*/
  typeList,
}: SelectTypeFormProps) {
  const [isOpen, setIsOpen] = useState(false); 

  const {
    register,
    //handleSubmit,
    setValue,
    //formState: { errors },
  } = useForm<SelectTypeFormFields>();

  return (
    <div className="flex flex-col space-y-3 w-1/2">
      <h1 className="font-semibold text-xl">Select type</h1>
      <form action="post">
        <div className="flex flex-row space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Select tyoe"
              {...register("name")}
              onClick={() => setIsOpen(!isOpen)}
              readOnly
              className="cursor-pointer px-4 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200 rounded-md py-2 w-64"
            />
            {isOpen && (
              <div className="absolute z-10 mt-1 backdrop-blur-xl w-64">
                <div className="border border-solid border-gray-200 overflow-auto max-h-60">
                  {typeList.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => {
                        setValue("name", type.name);
                        setIsOpen(false);
                      }}
                      className="cursor-pointer hover:bg-gray-200 px-4 py-2 border-b border-solid border-gray-300"
                    >
                      {type.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              className="px-4 py-2 bg-rose-500 text-white rounded-md"
              type="submit"
            >
              Confirm type
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

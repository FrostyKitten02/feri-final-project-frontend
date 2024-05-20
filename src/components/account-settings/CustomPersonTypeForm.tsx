import { useForm } from "react-hook-form";
import { CustomPersonTypeFormProps } from "../../interfaces";
import { CustomPersonTypeFormFields } from "../../types/forms/formTypes";

export default function CustomPersonTypeForm({
  onSubmit,
}: CustomPersonTypeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomPersonTypeFormFields>();

  return (
    <div className="flex flex-col space-y-3 w-1/2">
      <h1 className="font-semibold text-xl">Define custom type</h1>
      <form action="post" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-3">
            <label className="text-gray-700 font-semibold text-lg">Name</label>
            <input
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              type="text"
              placeholder="Enter type name"
              {...register("name", {
                required: "Name can not be empty!",
              })}
            />
            {errors.name && (
              <div className="text-red-500 font-semibold">
                {errors.name.message}
              </div>
            )}
          </div>
          <div className="flex flex-row space-x-12">
            <div className="flex flex-col space-y-3">
              <label className="text-gray-700 font-semibold text-lg">
                Educate employment percentage
              </label>
              <div className="flex flex-row items-center space-x-3">
                <input
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-1/2"
                  type="number"
                  min={0}
                  max={100}
                  {...register("educateAvailability", {
                    required: "Title can not be empty!",
                  })}
                />
                <p className="w-1/2 font-semibold">%</p>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-gray-700 font-semibold text-lg">
                Research employment percentage
              </label>
              <div className="flex flex-row items-center space-x-3">
                <input
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-1/2"
                  type="number"
                  min={0}
                  max={100}
                  {...register("researchAvailability", {
                    required: "Title can not be empty!",
                  })}
                />

                <p className="w-1/2 font-semibold">%</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 italic text-md">
              Initial project availability will be calculated based on the
              provided percentages.
            </p>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-rose-500 text-white rounded-md"
              type="submit"
            >
              Create type
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

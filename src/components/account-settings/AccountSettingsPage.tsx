import { personTypeAPI } from "../../util/ApiDeclarations";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCookies } from "react-cookie";

type FormFields = {
    name: string;
    researchAvailability: number;
    educateAvailability: number;
}

export default function AccountSettingsPage() {
    const cookies = useCookies()


  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full px-12 py-6 w-full">
        <h1 className="flex justify-start items-center font-bold text-3xl py-6">
          Account settings
        </h1>
        <div className="flex flex-row w-full py-12 px-12">
          <div className="flex flex-col w-1/2 space-y-6">
            <h1 className="font-semibold text-xl">Employment type settings</h1>
            <div className="flex flex-col w-full space-y-6">
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-lg">
                  Title
                </label>
              </div>
              <div className="flex flex-row">
                <div className="w-1/4">
                  <label className="text-gray-700 font-semibold text-lg">
                    Educate employment percentage
                  </label>
                </div>
                <div className="w-1/4">
                  <label className="text-gray-700 font-semibold text-lg">
                    Research employment percentage
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 space-y-6">
            <h1 className="font-semibold text-xl">Clerk account information</h1>
            <p className="text-gray-500 italic text-md">
              To edit clerk account information, navigate to the Clerk "Manage
              account" section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { personTypeAPI } from "../../util/ApiDeclarations";
import { SubmitHandler } from "react-hook-form";
import { useRequestArgs } from "../../util/CustomHooks";
import { CreatePersonTypeRequest } from "../../../temp_ts";
import { toastError, toastSuccess } from "../toast-modals/ToastFunctions";
import { UserProfile } from "@clerk/clerk-react";
import { CustomPersonTypeFormFields } from "../../types/forms/formTypes";
import CustomPersonTypeForm from "./CustomPersonTypeForm";
import SelectTypeForm from "./SelectTypeForm";

const personType = [
  { id: "8222067c-57b5-4b2b-85f4-e522ecf70959", name: "type1" },
  { id: "8222067c-57b5-4b2b-85f4-e522ecf70959", name: "type2" },
  { id: "8222067c-57b5-4b2b-85f4-e522ecf70959", name: "type2" },
];

export default function AccountSettingsPage() {
  const requestArgs = useRequestArgs();

  const onSubmit: SubmitHandler<CustomPersonTypeFormFields> = async (
    data
  ): Promise<void> => {
    // onSUbmit function passed to the form (react hook form)
    const personType: CreatePersonTypeRequest = {
      name: data.name,
      research: data.researchAvailability / 100,
      educate: data.educateAvailability / 100,
      startDate: data.startDate,
      endDate: data.endDate,
      personId: "bb332249-77e7-41e5-add4-bce5bce26f80" // HARDCODED for testing, later only admin will add person types for users and id will be implemented dynamically
    };

    try {
      const response = await personTypeAPI.createPersonType(
        personType,
        requestArgs
      );
      if (response.status === 201) {
        toastSuccess("Your employment type was successfully saved!");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full px-12 py-6 w-full">
        <h1 className="flex justify-start items-center font-bold text-3xl py-6">
          Account settings
        </h1>
        <div className="flex flex-col w-full py-12 px-12 space-y-12 items-start">
          <div className="flex flex-col space-y-6">
            <h1 className="font-semibold text-2xl">Clerk account settings</h1>
            <UserProfile
              appearance={{ elements: { cardBox: "w-full h-full" } }}
            />
          </div>
          <div className="flex flex-col space-y-6 w-full">
            <h1 className="font-semibold text-2xl">Employment type settings</h1>
            <div className="flex flex-row border px-6 py-6 border-solid rounded-xl border-gray-200 shadow-2xl">
              <SelectTypeForm /*onSubmit={}*/ typeList={personType} />
              <CustomPersonTypeForm onSubmit={onSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

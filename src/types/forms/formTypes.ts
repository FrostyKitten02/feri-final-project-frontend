import { PersonDto } from "../../../temp_ts";

export type AddProjectFormFields = {
  title: string;
  startDate: string;
  endDate: string;
  projectBudgetSchemaId: string;
  staffBudget: number;
  travelBudget: number;
  equipmentBudget: number;
  subcontractingBudget: number;
};

export type WorkPackageFormFields = {
  title: string;
  startDate: string;
  endDate: string;
  isRelevant: boolean;
  assignedPM: number;
};

export type TaskFormFields = {
  title: string;
  startDate: string;
  endDate: string;
  isRelevant: boolean;
};

export type AssignPersonFormFields = {
  person: PersonDto;
};

export type CustomPersonTypeFormFields = {
  name: string;
  researchAvailability: number;
  educateAvailability: number;
  startDate: string;
  endDate: string;
};

export type SelectTypeFormFields = {
  name: string;
};

// placeholder type for props until we have client interface; won't be present in this file
export type PersonType = { id: string; name: string }[];

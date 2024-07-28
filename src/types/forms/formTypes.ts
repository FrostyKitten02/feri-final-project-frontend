import { PersonDtoImpl } from "../../../temp_ts";

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
  person: PersonDtoImpl;
};

export type PersonTypeFormFields = {
  name: string;
  research: number;
  educate: number;
  startDate: string;
  endDate: string;
  personId: PersonDtoImpl;
};

export type SalaryFormFields = {
  personId: PersonDtoImpl;
  amount: number;
  startDate: string;
  endDate: string;
};

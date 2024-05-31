export type WorkPackageFormFields = {
  title: string;
  startDate: string;
  endDate: string;
  isRelevant: boolean;
};

export type TaskFormFields = {
  title: string;
  startDate: string;
  endDate: string;
  isRelevant: boolean;
}

export type CustomPersonTypeFormFields = {
  name: string;
  researchAvailability: number;
  educateAvailability: number;
};

export type SelectTypeFormFields = {
    name: string;
}

// placeholder type for props until we have client interface; won't be present in this file
export type PersonType = { id: string, name: string }[];

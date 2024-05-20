import {FC} from "react";
import { SubmitHandler } from "react-hook-form";
import {
  WorkPackageFormFields,
  CustomPersonTypeFormFields,
  //SelectTypeFormFields,
  PersonType,
} from "./types/forms/formTypes";

export interface SidebarTemplateProps {
  items: ListItem[];
  showReturn: boolean;
}

export interface ListItem {
  name: string;
  linkPath: string;
  iconComponent?: FC<any>;
}

export interface SidebarItemProps {
    item: ListItem,
    handleSelect: (name: string) => void,
    selected: string,
    opened: boolean
}

export interface CustomTabProps {
    tabLink: (title: string) => void,
    selectedTab: string,
    title: string
}

export interface ProjectListingProps {
    isLoading: boolean,
    allProjects: ListProjectResponse | null,
    modalOpen: boolean,
    open: () => void,
    close: () => void,

}

export interface ProjectItemProps {
    project?: ProjectDto,
    addButton?: boolean,
    modalOpen?: boolean,
    open?: () => void,
    close?: () => void,
}

export interface WorkPackageFormProps {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: SubmitHandler<WorkPackageFormFields>;
}

export interface CustomPersonTypeFormProps {
  onSubmit: SubmitHandler<CustomPersonTypeFormFields>;
}

export interface SelectTypeFormProps {
  //onSubmit: SubmitHandler<SelectTypeFormFields>;
  typeList: PersonType
}


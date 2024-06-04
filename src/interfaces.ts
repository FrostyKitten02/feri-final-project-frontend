import { FC } from "react";
import {
  ListProjectResponse,
  ProjectDto,
  TaskDto,
  WorkPackageDto,
} from "../temp_ts";
import { SubmitHandler } from "react-hook-form";
import {
  CustomPersonTypeFormFields,
  //SelectTypeFormFields,
  PersonType,
} from "./types/forms/formTypes";
import * as React from "react";

export interface SidebarTemplateProps {
  items: ListItem[];
  showReturn: boolean;
}

export interface ListItem {
  name: string;
  linkPath: string;
  iconComponent: FC<any>;
}

export interface SidebarItemProps {
  item: ListItem;
  handleSelect: (name: string) => void;
  selected: string;
  opened: boolean;
}

export interface CustomTabProps {
  tabLink: (title: string) => void;
  selectedTab: string;
  title: string;
}

export interface ProjectListingProps {
  isLoading: boolean;
  allProjects: ListProjectResponse | null;
}

export interface ProjectItemProps {
  project?: ProjectDto;
}

export interface WorkPackageListingProps {
    isFormOpen: boolean;
    setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface WorkPackageItemProps {
  workPackage?: WorkPackageDto;
  onClick: (id?: string, title?: string) => void;
}

export interface TaskListingProps {
  workPackageId?: string;
}

export interface TaskItemProps {
  task?: TaskDto;
  onAssignClick: (id?: string, title?: string) => void;
}

export interface AddNewProjectModalProps {
  handleClose: () => void;
  handleAddProject: () => void;
}

export interface WorkPackageFormProps {
  handleClose: () => void;
  handleAddWorkPackage: () => void;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TaskModalProps {
  handleClose: () => void;
  handleAddTask: () => void;
  workPackageId: string;
  workPackageTitle: string;
}

export interface AssignPersonModalProps {
  handleClose: () => void;
  taskId: string;
  taskTitle: string;
}

export interface CustomPersonTypeFormProps {
  onSubmit: SubmitHandler<CustomPersonTypeFormFields>;
}

export interface SelectTypeFormProps {
  //onSubmit: SubmitHandler<SelectTypeFormFields>;
  typeList: PersonType;
}

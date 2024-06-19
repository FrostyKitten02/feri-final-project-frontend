import { FC } from "react";
import { ProjectDto, TaskDto, WorkPackageDto } from "../temp_ts";
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

export interface ProjectItemProps {
  project?: ProjectDto;
}

export interface WorkPackageListingProps {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface WorkPackageItemProps {
  workPackage?: WorkPackageDto;
  onClick: (id?: string, title?: string, startDate?: string, endDate?: string) => void;
}

export interface TaskListingProps {
  workPackageId?: string;
}

export interface TaskItemProps {
  task?: TaskDto;
  showIrrelevant: boolean;
}

export interface WorkPackageFormProps {
  handleClose: () => void;
  handleAddWorkPackage: () => void;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface WorkPackageModalProps {
  handleClose: () => void;
  handleAddWorkPackage: () => void;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TaskModalProps {
  handleClose: () => void;
  handleAddTask: () => void;
  workPackageId: string;
  workPackageTitle: string;
  workPackageStartDate: string;
  workPackageEndDate: string;
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

export interface ProgressObject {
  text: string;
  color: string;
}

export interface ProjectModalProps {
  handleAddProject: () => void;
}

export interface CustomModalErrorProps {
  error: string | undefined;
}

export interface CustomModalProps {
  closeModal: () => void;
  modalWidth: string;
  children?: React.ReactNode;
}

export interface CustomModalHeaderProps {
  handleModalOpen: () => void;
  children?: React.ReactNode;
}

export interface ModalTitleProps {
  children?: React.ReactNode;
}

export interface ModalTextProps {
  children?: React.ReactNode;
  showInfoIcon: boolean;
  showWarningIcon: boolean;
  contentColor: string;
}

export interface CustomModalBodyProps {
  children?: React.ReactNode;
}

export interface ModalDividerProps {
  children?: React.ReactNode;
}

export interface CustomModalFooterProps {
  children?: React.ReactNode;
}
export interface BackdropProps {
  children?: React.ReactNode;
  closeModal: () => void;
}

export interface CustomPaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalElements?: number;
}

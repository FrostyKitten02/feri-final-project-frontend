import { FC } from "react";
import {
  PersonDto,
  ProjectDto,
  ProjectStatisticsResponse,
  TaskDto,
  WorkPackageDto,
} from "../temp_ts";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { SelectedItemProps } from "./components/template/inputs/inputsInterface";

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
  item: ListItem;
  handleSelect: (name: string) => void;
  selected: string;
  opened: boolean;
}

export interface ProjectItemProps {
  project?: ProjectDto;
  handleEditProject: () => void;
}

export interface WorkPackageItemProps {
  workPackage?: WorkPackageDto;
  handleAddTask: () => void;
  handleEditWorkPackage: () => void;
  projectDetails?: ProjectDto;
}

export interface TaskListingProps {
  tasks: TaskDto[];
  handleEditTask: () => void;
  workPackageTitle?: string;
  workPackageStartDate?: string;
  workPackageEndDate?: string;
}

export interface TaskItemProps {
  task?: TaskDto;
  showIrrelevant: boolean;
  handleEditTask: () => void;
  workPackageTitle?: string;
  workPackageStartDate?: string;
  workPackageEndDate?: string;
}

export interface WorkPackageFormProps {
  handleClose: () => void;
  handleAddWorkPackage: () => void;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface WorkPackageModalProps {
  handleAddWorkPackage: () => void;
  projectDetails?: ProjectDto;
  edit: boolean;
  title?: string;
  startDate?: string;
  endDate?: string;
  isRelevant?: boolean;
  assignedPM?: number;
  workPackageId?: string;
}

export interface TaskModalProps {
  handleAddTask: () => void;
  workPackageId?: string;
  workPackageTitle?: string;
  workPackageStartDate?: string;
  workPackageEndDate?: string;
  disabled: boolean;
  edit: boolean;
  taskTitle?: string;
  taskStartDate?: string;
  taskEndDate?: string;
  taskIsRelevant?: boolean;
  taskId?: string;
}

export interface TeamModalProps {
  handleAddPerson: () => void;
}

export interface AssignPersonModalProps {
  handleClose: () => void;
  taskId: string;
  taskTitle: string;
}

export interface PersonTypeModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SalaryModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PopoverMenuProps {
  setAdminPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPersonTypeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSalaryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ProgressObject {
  text: string;
  color: string;
}

export interface ProjectModalProps {
  handleAddProject: () => void;
  edit: boolean;
  projectId?: string;
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
  danger?: boolean;
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
  backLabelText?: string;
  nextLabelText?: string;
}

export interface WorkpackageLimitProps {
  id: string;
  startDate: string;
  endDate: string;
}

export interface UserSearchInputProps<
  T extends FieldValues,
  K extends Path<T>
> {
  setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: ControllerRenderProps<T, K>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  listOpen: boolean;
  filteredPeople: PersonDto[];
  handleSelectPerson: (person: PersonDto) => void;
  inputWidth?: number;
}

export interface ProjectFilterProps {
  handleProjectAdd: () => void;
  selectedStatus: SelectedItemProps;
  setSelectedStatus: (item: SelectedItemProps) => void;
}

export interface YearLimitProps {
  start: number;
  end: number;
  name: string;
}

export interface WorkloadTableProps {
  statistics: ProjectStatisticsResponse;
  currentPage: number;
  monthsPerPage: number;
}

export interface DeleteModalProps {
  title?: string;
  handleDelete?: () => Promise<void>;
  teamPage?: boolean;
}

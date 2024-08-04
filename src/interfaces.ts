import {
  ProjectBudgetSchemaDto,
  PersonDto,
  ProjectDto,
  ProjectStatisticsResponse,
  TaskDto,
  WorkPackageDto,
  PersonWorkDto,
} from "../temp_ts";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { SelectedItemProps } from "./components/template/inputs/inputsInterface";
import { ReactElement } from "react";

export interface SidebarTemplateProps {
  items: ListItem[];
  showReturn: boolean;
}

export interface ListItem {
  name: string;
  linkPath: string;
  iconComponent: (props: { className: string }) => ReactElement;
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

export interface AdminModalProps {
  setActionPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onButtonClick?: () => void;
  onModalClose?: () => void;
  userId?: string;
  userEmail?: string;
  refetchUserList?: () => void;
}

export interface SalaryModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ManageUsersModalProps {
  sidebarOpened: boolean;
}

export interface PopoverMenuProps {
  userId?: string;
  userEmail?: string;
  refetchUserList?: () => void;
  manageProject?: boolean;
  sidebarOpened?: boolean;
}

export interface ProgressObject {
  text: string;
  color: string;
}

export interface ProjectModalProps {
  handleAddProject?: () => void;
  edit?: boolean;
  popoverEdit?: boolean;
  projectId?: string;
  setActionPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onButtonClick?: () => void;
  onModalClose?: () => void;
}

export interface CustomModalErrorProps {
  error: string | undefined;
}

export interface ModalPortalProps {
  children: React.ReactNode;
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
  showInfoIcon?: boolean;
  showWarningIcon?: boolean;
  contentColor: string;
}

export interface CustomModalBodyProps {
  children?: React.ReactNode;
}

export interface ModalDividerProps {
  children?: React.ReactNode;
  paddingTop?: string;
  paddingBottom?: string;
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
  setListOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  field?: ControllerRenderProps<T, K>;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  inputValue?: string;
  listOpen?: boolean;
  filteredPeople?: PersonDto[];
  handleSelectPerson?: (person: PersonDto) => void;
  inputWidth?: number;
  showResults: boolean;
}

export interface ProjectFilterProps {
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
  handleEdit: () => void;
}

export interface DeleteModalProps {
  id?: string;
  title?: string;
  handleDelete?: () => void;
  teamPage?: boolean;
  workPackage?: boolean;
  personName?: string;
  personLastName?: string;
  personEmail?: string;
}

export interface WorkloadModalProps {
  closeModal: () => void;
  modalWidth: string;
  monthDate: string;
  person: PersonWorkDto;
  handleEdit: () => void;
}
export interface DonutGraphData {
  name: string;
  value: number;
}
export interface ProjectDetailsProps {
  project: ProjectDto;
  chosenSchema: ProjectBudgetSchemaDto;
}
export interface WorkDetailsProps {
  project: ProjectDto;
  statistics: ProjectStatisticsResponse;
}

export interface WorkDetailsLineChartProps {
  date: string;
  pmPerMonth: number;
}

export interface CurrentMonthProps {
  statistics: ProjectStatisticsResponse;
}

export interface CostTimelineChartProps {
  date: string;
  "Actual cost": number;
  "Predicted cost": number;
}

export interface CostTimelineProps {
  stats: ProjectStatisticsResponse;
}

export interface ManageProjectModalProps {
  sidebarOpened: boolean;
}

export interface PopoverItem {
  component: React.ReactElement;
}

export interface PopoverProps {
  items: PopoverItem[];
  triggerIcon: React.ReactNode;
  height?: number;
}

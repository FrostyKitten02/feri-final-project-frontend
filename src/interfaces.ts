import {
  ProjectBudgetSchemaDto,
  PersonDto,
  ProjectDto,
  ProjectStatisticsResponse,
  TaskDto,
  WorkPackageDto,
  PersonWorkDto,
  ProjectFileDto,
  ProjectStatisticsUnitDto, PersonOnProjectDto,
} from "../client";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { SelectedItemProps } from "./components/template/inputs/inputsInterface";
import { ReactElement } from "react";
import { PopoverBaseProps } from "./components/template/popover-menu/popoverinterfaces";
import { Color } from "@tremor/react";

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
  onSuccess: () => void;
  projectDetails?: ProjectDto;
}

export interface TaskListingProps {
  workpackage: WorkPackageDto;
  onSuccess: () => void;
}

export interface TaskItemProps {
  task?: TaskDto;
  workpackage?: WorkPackageDto;
  showIrrelevant: boolean;
  onSuccess: () => void;
}

export interface WorkPackageModalProps extends PopoverBaseProps {
  onSuccess: () => void;
  projectDetails?: ProjectDto;
  workpackage?: WorkPackageDto;
}

export interface TaskModalProps extends PopoverBaseProps {
  onSuccess: () => void;
  workpackage?: WorkPackageDto;
  task?: TaskDto;
}

export interface TeamModalProps {
  handleAddPerson: () => void;
}

export interface AdminModalProps extends PopoverBaseProps {
  userId?: string;
  userEmail?: string;
  refetchUserList?: () => void;
}

export interface ManageUsersModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ProgressObject {
  text: string;
  color: Color;
  animation?: string;
  bgColor?: string;
}

export interface ProjectModalProps extends PopoverBaseProps {
  handleProjectSubmit?: () => void;
  edit?: boolean;
  popoverEdit?: boolean;
  project?: ProjectDto;
  projectId?: string;
  callToAction?: boolean;
}

export interface CustomModalErrorProps {
  error: string | undefined;
}

export interface ModalPortalProps {
  children: React.ReactNode;
}

export interface CustomModalProps {
  closeModal: () => void;
  modalWidth?: string;
  modalHeight?: string;
  children?: React.ReactNode;
  marginY?: string;
}

export interface CustomModalHeaderProps {
  handleModalClose: () => void;
  children?: React.ReactNode;
}

export interface ModalTitleProps {
  children?: React.ReactNode;
}

export interface ModalTextProps {
  children?: React.ReactNode;
  showIcon?: boolean;
  contentColor?: string;
}

export interface CustomModalBodyProps {
  children?: React.ReactNode;
  padding?: string;
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
  setHookFormValue?: () => void;
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

export interface WorkloadModalProps {
  closeModal: () => void;
  modalWidth: string;
  monthDate: string;
  person: { workPerson: PersonWorkDto | undefined, person: PersonDto };
  handleEdit: () => void;
  personal?: PersonDto;
}

export interface DonutGraphData {
  name: string;
  value: number;
}

export interface ProjectDetailsProps {
  project: ProjectDto;
  chosenSchema: ProjectBudgetSchemaDto;
  handleEditProject: () => void;
}

export interface WorkDetailsProps {
  project: ProjectDto;
  statistics: ProjectStatisticsResponse;
}

export interface WorkDetailsLineChartProps {
  date: string;
  "PM per month": number;
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

export interface PopoverItem {
  component: React.ReactElement;
  icon?: React.ReactNode;
  label: string;
}

export interface PopoverProps {
  items: PopoverItem[];
  triggerIcon: React.ReactNode;
  height?: number;
  width?: number;
  position?: "top" | "bottom" | "top-right";
}

export interface DeleteWorkPackageModalProps extends PopoverBaseProps {
  workpackage?: WorkPackageDto;
  onSuccess: () => void;
}

export interface DeleteTaskModalProps extends PopoverBaseProps {
  task: TaskDto;
  onSuccess: () => void;
}

export interface DeleteTeamModalProps {
  person: PersonDto;
  onSuccess: () => void;
}

export interface BudgetBreakdownProps {
  statistics: ProjectStatisticsResponse | undefined;
}

export interface BudgetBreakdownChartProps {
  usedBudget: number;
  totalBudget: number;
  percentage: number;
}

export interface BudgetBreakdownTrackerData {
  color: string;
  tooltip: string;
}

export interface BudgetBreakdownTrackerData {
  color: string;
  tooltip: string;
}

export interface UserDetailsProjectData {
  all: number;
  active: number;
}

export interface UserDetailsChartData {
  name: string;
  value: number;
}

export interface CurrentlyRelevantChartData {
  name: string;
  Assigned: number;
  Actual: number;
}

export interface CurrentlyRelevantData {
  chartData: Array<CurrentlyRelevantChartData>;
  barColor: Array<string>;
  foundMonth?: ProjectStatisticsUnitDto | undefined;
}

export interface CurrentlyRelevantCurrDate {
  year: string;
  month: string;
}

export interface ActiveProjectsChartData {
  name: string;
  Used: number;
  Available: number;
}

export interface ActiveProjectsChartProps {
  projectId: string;
  stateData: ActiveProjectsStateData;
}
export interface ActiveProjectsStateData {
  dataPm: Array<ActiveProjectsChartData>;
  dataBudget: Array<ActiveProjectsChartData>;
}

export interface ProjectSectionItemProps {
  project: ProjectDto;
  currentPerson: PersonDto
}

export interface FileUploadModalProps {
  refetchFileList: () => void;
}

export interface DeleteFileModalProps extends PopoverBaseProps {
  file: ProjectFileDto;
  refetchFileList: () => void;
}

export interface ReportPageChartData {
  pmData: { name: string; Estimated: number; Actual: number };
  budgetData: { name: string; Estimated: number; Actual: number };
}

export interface PreviewFileModalProps extends PopoverBaseProps {
  fileId?: string;
  fileType?: string;
  fileName?: string;
}

export interface ReportPdfProps {
  reportType: string;
  barChartData?: ReportPageChartData;
  chosenMonthly?: Array<ProjectStatisticsUnitDto>;
  projectPeople?: Array<PersonOnProjectDto>
  people?: { [key: string]: PersonDto; };
}

export interface ClerkUserButtonProps {
  person?: PersonDto;
}

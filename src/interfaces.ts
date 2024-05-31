import { FC } from "react";
import {ListProjectResponse, ProjectDto, TaskDto, WorkPackageDto} from "../temp_ts";
import { SubmitHandler } from "react-hook-form";
import {
    WorkPackageFormFields,
    CustomPersonTypeFormFields,
    //SelectTypeFormFields,
    PersonType,
} from "./types/forms/formTypes";
import * as React from "react";

export interface SidebarTemplateProps {
    items: ListItem [],
    showReturn: boolean
}

export interface ListItem {
    name: string,
    linkPath: string,
    iconComponent: FC<any>

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
    allProjects: ListProjectResponse | null
}

export interface ProjectItemProps {
    project?: ProjectDto
}

export interface WorkPackageListingProps {
    isLoading: boolean,
    allWorkPackages: WorkPackageDto[],
    allWorkPackageTasks: TaskDto[],
    onClick: (id?: string) => void,
    onAssignClick: (id?: string) => void
}

export interface WorkPackageItemProps {
    workPackage?: WorkPackageDto,
    allWorkPackageTasks: TaskDto[] 
    onClick: (id?: string) => void, 
    onAssignClick: (id?: string) => void
}

export interface TaskListingProps {
    allTasks: TaskDto[]
    onAssignClick: (id?: string) => void
}

export interface TaskItemProps {
    task?: TaskDto,
    onAssignClick: (id?: string) => void
}

export interface AddNewProjectModalProps {
    handleClose: () => void;
    handleAddProject: () => void;
}

export interface WorkPackageFormProps {
    isFormOpen: boolean,
    setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: SubmitHandler<WorkPackageFormFields>
}

export interface TaskModalProps {
    handleClose: () => void,
    handleAddTask: () => void,
    workPackageId: string
}

export interface AssignPersonModalProps {
    handleClose: () => void,
    taskId: string
}

export interface CustomPersonTypeFormProps {
    onSubmit: SubmitHandler<CustomPersonTypeFormFields>
}

export interface SelectTypeFormProps {
    //onSubmit: SubmitHandler<SelectTypeFormFields>;
    typeList: PersonType
}

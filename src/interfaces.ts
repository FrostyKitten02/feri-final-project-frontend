import {FC} from "react";
import {ListProjectResponse} from "../temp_ts";

export interface SidebarTemplateProps {
    items: ListItem [],
    showReturn: boolean
}

export interface ListItem {
    name: string,
    linkPath: string,
    iconComponent?: FC<any>

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
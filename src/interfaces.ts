import {FC} from "react";

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
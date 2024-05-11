import * as React from "react";

export interface SidebarTemplateProps {
    items: ListItem []
}

export interface ListItem {
    name: string,
    linkPath: string,
    iconPath?: string
    alt?: string

}
export interface SidebarItemProps {
    item: ListItem,
    handleSelect: (name: string) => void,
    selected: string
}
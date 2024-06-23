import {UseFormRegister} from "react-hook-form";
import {ReactNode} from "react";

export interface NumberInputProps {
    showArrows?: boolean,
    focusColor ?: string,
    register?: UseFormRegister<any>,
    name?: string,
    icon?: ReactNode,
    placeholderText?: string
    
}

export interface TextInputProps {
    
}

export interface SelectProps {
    children?: ReactNode,
    placeholderText?: string,
    focusColor?: string,
    selected: any,
    setSelected: (item: SelectedItemProps) => void
}

export interface SelectOptionProps {
    hidden?: boolean,
    value: string | number,
    textColor?: string,
    onSelect?: (value: string | number, text: string | number) => void,
    icon?: ReactNode,
    children: string,
    isFirst?: boolean,
    isLast?: boolean,
}

export interface SelectedItemProps {
    value: string | number,
    text: string | number
}
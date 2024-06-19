import {UseFormRegister} from "react-hook-form";
import {ReactNode} from "react";

export interface NumberInputProps {
    showArrows?: boolean,
    color ?: string,
    register?: UseFormRegister<any>,
    name?: string,
    icon?: ReactNode,
    placeholderText?: string
    
}

export interface TextInputProps {
    
}
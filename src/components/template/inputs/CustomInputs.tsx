import React from "react";
import {NumberInputProps} from "./inputsInterface";

export const TextInput = () => {
    return (
        <React.Fragment>

        </React.Fragment>
    )
}


export const NumberInput = ({showArrows, register, name, icon, placeholderText}: NumberInputProps) => {
    const showArrowsClass = !showArrows ? `no-arrows` : ``;
    //const colorClass = color ?? `bg-blue-50;`
    return (
        <div className="relative bg-red-50">
            <div className="absolute bg-red-50 h-full right-0 flex justify-center items-center z-10">
                {icon}
            </div>
            <input type="number"
                   placeholder={placeholderText}
                   className={`rounded-lg bg-gray-50 pr-10 border-gray-300 ${showArrowsClass}`}
                   {...register && name ? register(name) : {}}
            />
        </div>

    )
}
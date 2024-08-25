import React, {useEffect, useRef, useState} from "react";
import {NumberInputProps, SelectedItemProps, SelectOptionProps, SelectProps} from "./inputsInterface";
import {FaAngleDown} from "react-icons/fa6";
import ColorVariants from "../../../util/ColorVariants";

export const NumberInput = ({showArrows, register, name, icon, placeholderText}: NumberInputProps) => {
    const showArrowsClass = !showArrows ? `no-arrows` : ``;
    return (
        <div className="relative">
            <div className="absolute bg-red-50 h-full right-0 flex justify-center items-center z-10">
                {icon}
            </div>
            <input type="number"
                   placeholder={placeholderText}
                   className={`rounded-lg bg-gray-50 pr-10 border-gray-300 h-[42px] appearance-none ${showArrowsClass}`}
                   {...register && name ? register(name) : {}}
            />
        </div>
    )
}

export const CSelect = ({children, placeholderText, focusColor, selected, setSelected}: SelectProps) => {
    const [opened, setOpened] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const focusClass = `focus:ring-2 ${ColorVariants.getFocus(focusColor)}`;
    const handleSelectChange = (value: string, text: string) => {
        const item: SelectedItemProps  = {
            value: value,
            text: text
        }
        setSelected(item);
        setOpened(false);
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpened(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className={`relative h-[42px]`} ref={dropdownRef}>
            <button value={selected?.value}
                    onClick={() => setOpened((prev) => !prev)}
                    className={`relative rounded-lg w-full bg-gray-50 ${selected.value ? "text-black" : "text-gray-400"} ${focusClass} text-sm pr-10 h-full border-gray-300 border-[1px] border-solid`}>
                <div className="absolute right-0 px-2 top-0 flex items-center h-full">
                    <FaAngleDown size={15} fill="gray"/>
                </div>
                <div className="text-start pl-2">
                    {selected.value ? selected.text : placeholderText}
                </div>
            </button>
            {opened && (
                <div
                    className="absolute mt-1 w-full pr-[2px] py-[2px] rounded-lg border border-gray-300 border-solid bg-white shadow-lg z-10">
                    <div className="h-[200px] overflow-y-auto">
                        {React.Children.map(children, (child, index) =>
                            React.cloneElement(child as React.ReactElement, {
                                onSelect: handleSelectChange,
                                isFirst: index === 0,
                                isLast: index === React.Children.count(children) - 1,
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export const SelectOption = ({
                                 hidden,
                                 value,
                                 textColor,
                                 isFirst,
                                 isLast,
                                 onSelect,
                                 icon,
                                 children
                             }: SelectOptionProps) => {
    const textColorClass: string = textColor ? `${ColorVariants.getText(textColor)}` : "text-black";
    return (
        <div hidden={hidden}>
            <button
                className={`flex text-start w-full h-full hover:bg-gray-50 transition delay-50 ${textColorClass} ${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`}
                onClick={onSelect ? () => onSelect(value, children) : () => {}
                }
            >
                <div className="p-2 space-x-2 flex items-center w-full h-full">
                    <span>
                        {icon}
                    </span>
                    <span className="text-sm tracking-wide">
                      {children}
                    </span>
                </div>
            </button>
        </div>
    )
}
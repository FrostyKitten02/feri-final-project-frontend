import {
    CustomModalBodyProps,
    CustomModalErrorProps, CustomModalFooterProps,
    CustomModalHeaderProps,
    CustomModalProps, ModalDividerProps,
    ModalTextProps,
    ModalTitleProps
} from "../../../interfaces";
import Backdrop from "./Backdrop";
import {IoMdClose, IoMdInformationCircleOutline} from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import {Label} from "flowbite-react";
import ColorVariants from "../../../util/ColorVariants";
import {CgDanger} from "react-icons/cg";

export const CustomModal = ({children, closeModal, modalWidth = "600px"}: CustomModalProps) => {
    return (
        <Backdrop closeModal={closeModal}>
            <div className="bg-white rounded-xl text-black"
                 style={{width: modalWidth}}
                 onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </Backdrop>
    )
}
export const CustomModalHeader = ({handleModalClose, children}: CustomModalHeaderProps) => {
    return (
        <div className="flex flex-row p-6 border-gray-300 border-b-[1px] border-solid">
            <div className="flex-grow">
                {children}
            </div>
            <div>
                <button onClick={handleModalClose}>
                    <IoMdClose/>
                </button>
            </div>
        </div>
    )
}
export const ModalTitle = ({children}: ModalTitleProps) => {
    return (
        <div className="uppercase font-bold text-2xl">
            {children}
        </div>
    )
}

export const ModalText = ({children, showIcon = false, contentColor = "muted"}: ModalTextProps) => {
    return (
        <div className={`flex ${ColorVariants.getText(contentColor)} pt-1`}>
            <div className="pt-[2px]">
                {
                    showIcon && (
                        contentColor === "muted" ?
                        <IoMdInformationCircleOutline/> :
                        contentColor === "warning" ?
                        <IoWarningOutline /> :
                        contentColor === "danger" &&
                        <CgDanger />
                    )
                }
            </div>
            <div className="px-1 text-sm">
                {children}
            </div>
        </div>
    )
}

export const CustomModalBody = ({children}: CustomModalBodyProps) => {
    return (
        <div className="p-10">
            {children}
        </div>
    )
}
export const CustomModalFooter = ({children, danger = false}: CustomModalFooterProps) => {
    return (
        <div className="flex justify-end border-t-[1px] border-solid border-gray-300 p-6">
            <button
                type="submit"
                className={`uppercase tracking-wider px-8 py-2 ${danger ? `bg-danger` : `bg-primary`} transition delay-50 text-white rounded-xl`}
            >
                {children}
            </button>
        </div>
    )
}
export const ModalDivider = ({children, paddingTop, paddingBottom}: ModalDividerProps) => {
    return (
        <div className={`flex flex-row items-center ${paddingTop ?? `pt-12`} ${paddingBottom ?? `pb-6`}`}>
            <div className="w-[7%] h-[1px] bg-muted"/>
            <Label className="px-2 uppercase text-muted">
                {children}
            </Label>
            <div className="flex-grow h-[1px] bg-muted"/>
        </div>
    )
}
export const CustomModalError = ({error}: CustomModalErrorProps) => {
    return (
        <div className="text-red-500 h-4 text-xs pt-1 font-semibold">
            {error}
        </div>
    )
}
import {HiOutlineTrash} from "react-icons/hi2";
import {useState} from "react";
import {
    CustomModal,
    CustomModalBody, CustomModalError,
    CustomModalFooter,
    CustomModalHeader, ModalText,
    ModalTitle
} from "../../template/modal/CustomModal";
import {SubmitHandler, useForm} from "react-hook-form";
import {DeleteConfirmationFields} from "../../../types/types";
import {DeleteWorkPackageModalProps} from "../../../interfaces";
import {TextInput} from "flowbite-react";
import {workPackageAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {useRequestArgs} from "../../../util/CustomHooks";

export const DeleteWorkPackageModal = ({workpackage, onSuccess}: DeleteWorkPackageModalProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const requestArgs = useRequestArgs();
    const handleModalClose = (): void => {
        setOpen(false);
    };
    const {register, handleSubmit, formState: {errors}} = useForm<DeleteConfirmationFields>();
    const onDelete: SubmitHandler<any> = async () => {
        try {
            if (workpackage.id) {
                const response = await workPackageAPI.deleteWorkPackage(workpackage.id, requestArgs);
                if (response.status === 200 || response.status === 204) {
                    onSuccess();
                    toastSuccess(`Work package ${workpackage.title} was successfully deleted.`);
                    setOpen(false);
                }
            }

        } catch (error: any) {
            toastError(error.message);
        }
    }
    return (
        <>
            <button onClick={() => setOpen(true)}>
                <HiOutlineTrash className="size-6 stroke-red-500 transition delay-50 hover:stroke-red-500/70"/>
            </button>
            {
                open &&
                <CustomModal closeModal={handleModalClose}>
                    <form onSubmit={handleSubmit(onDelete)}>
                        <CustomModalHeader handleModalClose={handleModalClose}>
                            <ModalTitle>
                                delete work package
                            </ModalTitle>
                            <ModalText
                                contentColor="danger"
                                showIcon={true}
                            >
                                This action <span className="font-semibold"> cannot </span> be undone!
                                <span className="font-semibold"> {workpackage.title} </span>
                                will be <span className="font-semibold"> permanently </span> deleted.
                            </ModalText>
                        </CustomModalHeader>
                        <CustomModalBody>
                            <div className="font-semibold">
                                Please type in the full title of the work package to confirm deletion.
                            </div>
                            <TextInput
                                defaultValue={""}
                                type="text"
                                {...register("title", {
                                    required: "This field can not be empty!",
                                    validate: (value) => {
                                        if (workpackage && value !== workpackage.title) {
                                            return "The input text and the work package title don't match.";
                                        }
                                    },
                                })}
                            />
                            <CustomModalError error={errors.title?.message}/>
                        </CustomModalBody>
                        <CustomModalFooter danger={true}>
                            I understand, permanently delete.
                        </CustomModalFooter>
                    </form>
                </CustomModal>
            }
        </>
    )
}
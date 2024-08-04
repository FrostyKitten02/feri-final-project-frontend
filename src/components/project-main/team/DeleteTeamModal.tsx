import {useState} from "react";
import {useRequestArgs} from "../../../util/CustomHooks";
import {SubmitHandler, useForm} from "react-hook-form";
import {DeleteTeamModalFields} from "../../../types/types";
import {projectAPI} from "../../../util/ApiDeclarations";
import {toastError, toastSuccess} from "../../toast-modals/ToastFunctions";
import {
    CustomModal,
    CustomModalBody,
    CustomModalError, CustomModalFooter,
    CustomModalHeader,
    ModalText,
    ModalTitle
} from "../../template/modal/CustomModal";
import {TextInput} from "flowbite-react";
import {DeleteTeamModalProps} from "../../../interfaces";
import {useParams} from "react-router-dom";
import {BsPersonDash} from "react-icons/bs";

export const DeleteTeamModal = ({person, onSuccess}: DeleteTeamModalProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();
    const handleModalClose = (): void => {
        setOpen(false);
    };
    const {register, handleSubmit, formState: {errors}} = useForm<DeleteTeamModalFields>();
    const onDelete: SubmitHandler<any> = async () => {
        try {
            if (projectId && person.id) {
                const response = await projectAPI.removePersonFromProject(projectId, person.id, requestArgs);
                if (response.status === 200 || response.status === 204) {
                    onSuccess();
                    if (person.name && person.lastname) {
                        toastSuccess(`Employee ${person.email} was successfully removed.`)
                    } else {
                        toastSuccess(`Employee ${person.name + " " + person.lastname} was successfully removed.`);
                    }
                    handleModalClose();
                }
            }

        } catch (error: any) {
            toastError(error.message);
        }
    }
    return (
        <>
            <button onClick={() => setOpen(true)}>
                <BsPersonDash className="size-6 fill-gray-500 hover:fill-red-500 transition delay-50"/>
            </button>
            {
                open &&
                <CustomModal closeModal={handleModalClose}>
                    <form onSubmit={handleSubmit(onDelete)}>
                        <CustomModalHeader handleModalClose={handleModalClose}>
                            <ModalTitle>
                                remove employee
                            </ModalTitle>
                            <ModalText
                                contentColor="danger"
                                showIcon={true}
                            >
                                This action <span className="font-semibold"> cannot </span> be undone!
                                {
                                    person.name && person.lastname ?
                                        <>
                                            <span className="font-semibold"> {person.name + " " + person.lastname} </span>
                                            will be removed.
                                        </> :
                                        <>
                                            <span className="font-semibold"> {person.email} </span>
                                            will be removed.
                                        </>
                                }
                            </ModalText>
                        </CustomModalHeader>
                        <CustomModalBody>
                            <div className="font-semibold">
                                Please type in the full email of employee ({person.email}) to confirm deletion.
                            </div>
                            <TextInput
                                defaultValue={""}
                                type="text"
                                {...register("email", {
                                    required: "This field can not be empty!",
                                    validate: (value) => {
                                        if (person.email && value !== person.email) {
                                            return "The input text and the employee email don't match.";
                                        }
                                    },
                                })}
                            />
                            <CustomModalError error={errors.email?.message}/>
                        </CustomModalBody>
                        <CustomModalFooter danger={true}>
                            I understand, remove.
                        </CustomModalFooter>
                    </form>
                </CustomModal>
            }
        </>
    )
}
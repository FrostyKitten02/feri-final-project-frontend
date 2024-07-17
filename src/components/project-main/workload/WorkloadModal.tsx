import {
    CustomModal,
    CustomModalBody,
    CustomModalFooter,
    CustomModalHeader, ModalText,
    ModalTitle
} from "../../template/modal/CustomModal";
import {WorkloadModalProps} from "../../../interfaces";

export const WorkloadModal = ({closeModal, modalWidth}: WorkloadModalProps) => {
    return (
        <CustomModal closeModal={closeModal} modalWidth={modalWidth}>
            <CustomModalHeader handleModalOpen={closeModal}>
                <ModalTitle>
                    Edit workload
                </ModalTitle>
                <ModalText showInfoIcon={true} showWarningIcon={false} contentColor="muted">
                    You are currently editing person's workload for Month, YEar.
                </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
                modal body
            </CustomModalBody>
            <CustomModalFooter>
                edit
            </CustomModalFooter>
        </CustomModal>
    )
}
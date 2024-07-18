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
                    You are currently editing person's workload for Month, Year.
                </ModalText>
            </CustomModalHeader>
            <CustomModalBody>
                <div className="italic">
                    Still in progress.
                </div>
            </CustomModalBody>
            <CustomModalFooter>
                edit
            </CustomModalFooter>
        </CustomModal>
    )
}
import { useState } from "react";
import { DeleteModalProps } from "../../../interfaces";
import { HiOutlineTrash } from "react-icons/hi2";
import { BsPersonDash } from "react-icons/bs";
import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
  CustomModalHeader,
  ModalTitle,
} from "./CustomModal";

export default function DeleteModal({
  title,
  handleDelete,
  teamPage,
}: DeleteModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      {!teamPage ? (
        <button onClick={() => setModalOpen(true)}>
          <HiOutlineTrash className="size-6 stroke-red-500 transition delay-50 hover:stroke-red-500/70" />
        </button>
      ) : (
        <button onClick={() => setModalOpen(true)}>
          <BsPersonDash className="size-6 fill-gray-500 hover:fill-red-500 transition delay-50" />
        </button>
      )}

      {modalOpen && (
        <CustomModal closeModal={() => setModalOpen(false)} modalWidth="700px">
          <form onSubmit={handleDelete}>
            <CustomModalHeader handleModalOpen={() => setModalOpen(false)}>
              <ModalTitle>
                <span>{!teamPage ? "delete" : "remove"} confirmation</span>
              </ModalTitle>
            </CustomModalHeader>
            <CustomModalBody>
              <div className="flex flex-col gap-y-2">
                <p className="text-lg font-semibold">
                  Are you sure you want to{" "}
                  <span className="text-red-600">
                    {!teamPage ? "delete" : "remove"}
                  </span>{" "}
                  {title}?
                </p>
                <p className="text-lg font-bold">
                  This action can not be undone.
                </p>
              </div>
            </CustomModalBody>
            <CustomModalFooter danger={true}>
              <span className="flex flex-row gap-x-2">
                <HiOutlineTrash className="size-6 stroke-white" />
                <span>{!teamPage ? "delete" : "remove"}</span>
              </span>
            </CustomModalFooter>
          </form>
        </CustomModal>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { ManageUsersModalProps } from "../../interfaces";
import { motion } from "framer-motion";
import { BsPersonFillGear } from "react-icons/bs";
import {
  CustomModal,
  CustomModalBody,
  CustomModalHeader,
  ModalTitle,
} from "../template/modal/CustomModal";
import { toastError } from "../toast-modals/ToastFunctions";
import { personAPI } from "../../util/ApiDeclarations";
import { PersonDtoImpl } from "../../../temp_ts";
import { useRequestArgs } from "../../util/CustomHooks";
import PopoverMenu from "./PopoverMenu";

export default function ManageUsersModal({
  sidebarOpened,
}: ManageUsersModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<PersonDtoImpl[]>([]);

  const requestArgs = useRequestArgs();

  useEffect(() => {
    if (modalOpen) {
      fetchAllUsers();
    }
  }, [modalOpen]);

  const fetchAllUsers = async (): Promise<void> => {
    try {
      const response = await personAPI.getAllPeople(requestArgs);
      if (response.status === 200) {
        setAllUsers(response.data);
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex flex-row justify-center items-center gap-x-3"
      >
        <BsPersonFillGear className="fill-white size-7" />
        {sidebarOpened && (
          <motion.span
            initial={{ visibility: "hidden", opacity: 0 }}
            animate={{ visibility: "visible", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-semibold"
          >
            MANAGE USERS
          </motion.span>
        )}
      </button>
      {modalOpen && (
        <CustomModal closeModal={() => setModalOpen(false)} modalWidth="1500px">
          <CustomModalHeader handleModalOpen={() => setModalOpen(false)}>
            <ModalTitle>manage users</ModalTitle>
          </CustomModalHeader>
          <CustomModalBody>
            <div className="flex flex-col">
              <div className="flex flex-row justify-end">
                test
              </div>
              <div className="w-full h-full">
                {allUsers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-5 pt-8 pb-4">
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          NAME
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          EMAIL ADDRESS
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          SALARY
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          EMPLOYMENT TYPE
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-4">
                        <div className="text-sm text-gray-600 font-semibold">
                          ACTION
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-solid border-gray-200 overflow-visible bg-white shadow-md divide-y divide-solid divide-gray-200">
                      {allUsers?.map((user) => (
                        <div
                          className="grid grid-cols-5 py-6 hover:bg-gray-200 transition delay-50"
                          key={user.id}
                        >
                          <div className="flex items-center justify-center text-sm font-semibold">
                            <div>
                              {user.name} {user.lastname}
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-sm font-normal text-gray-500">
                            {user.email}
                          </div>
                          <div className="flex items-center justify-center">
                            N/A
                          </div>
                          <div className="flex items-center justify-center">
                            N/A
                          </div>
                          <div className="flex items-center justify-center relative">
                            <PopoverMenu userId={user.id} userEmail={user.email}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center">
                    <p className="text-2xl font-semibold">
                      There is no users in the database.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CustomModalBody>
        </CustomModal>
      )}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { PopoverMenuProps } from "../../interfaces";
import { motion } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";
import PersonTypeModal from "./PersonTypeModal";
import SalaryModal from "./SalaryModal";
import SalaryEmploymentHistoryModal from "./SalaryEmploymentHistoryModal";

export default function PopoverMenu({
  userId,
  userEmail,
  refetchUserList,
}: PopoverMenuProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const ignoreClickOutside = useRef<boolean>(false);
  const [actionPopoverOpen, setActionPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !ignoreClickOutside.current
      ) {
        setActionPopoverOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  const handlePopoverButtonClick = (): void => {
    ignoreClickOutside.current = true;
  };

  const handleModalClose = (): void => {
    ignoreClickOutside.current = false;
  };

  return (
    <>
      <button onClick={() => setActionPopoverOpen(true)}>
        <BsThreeDots className="size-6 fill-gray-700 hover:fill-primary transition delay-50" />
      </button>
      {actionPopoverOpen && (
        <motion.div
          animate={{ opacity: 1, y: -10 }}
          initial={{ opacity: 0 }}
          exit={{
            opacity: 0,
          }}
          className="flex flex-col absolute bg-white bottom-full w-64 h-32 rounded-xl shadow-xl border border-solid border-gray-200 divide-y"
          ref={popoverRef}
        >
          <div className="px-3 py-1 font-medium">
            Actions
          </div>
          <SalaryModal
            setActionPopoverOpen={setActionPopoverOpen}
            onButtonClick={handlePopoverButtonClick}
            onModalClose={handleModalClose}
            userId={userId}
            userEmail={userEmail}
            refetchUserList={refetchUserList}
          />
          <PersonTypeModal
            setActionPopoverOpen={setActionPopoverOpen}
            onButtonClick={handlePopoverButtonClick}
            onModalClose={handleModalClose}
            userId={userId}
            userEmail={userEmail}
            refetchUserList={refetchUserList}
          />

          <SalaryEmploymentHistoryModal
            setActionPopoverOpen={setActionPopoverOpen}
            onButtonClick={handlePopoverButtonClick}
            onModalClose={handleModalClose}
            userId={userId}
            userEmail={userEmail}
          />
        </motion.div>
      )}
    </>
  );
}

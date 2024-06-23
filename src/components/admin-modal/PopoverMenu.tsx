import { useEffect, useRef } from "react";
import { PopoverMenuProps } from "../../interfaces";
import { motion } from "framer-motion";
import { FaEuroSign } from "react-icons/fa6";
import { BsFillPersonVcardFill } from "react-icons/bs";

export default function PopoverMenu({
  setAdminPopoverOpen,
  setPersonTypeModalOpen,
  setSalaryModalOpen,
}: PopoverMenuProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setAdminPopoverOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: -10 }}
        initial={{ opacity: 0 }}
        exit={{
          opacity: 0,
        }}
        className="flex flex-col absolute bg-white bottom-full w-64 h-32 rounded-xl shadow-xl border border-solid border-gray-200 divide-y"
        ref={popoverRef}
      >
        <button
          onClick={() => {
            setPersonTypeModalOpen(true), setAdminPopoverOpen(false);
          }}
          className="flex flex-row items-center justify-start text-gray-500 h-full text-sm font-semibold hover:text-gray-800 fill-gray-500  hover:fill-gray-800 transition delay-50 gap-x-4 pl-4"
        >
          <BsFillPersonVcardFill className="size-4" />
          <span>Manage employment type</span>
        </button>
        <button
          onClick={() => {
            setSalaryModalOpen(true), setAdminPopoverOpen(false);
          }}
          className="flex flex-row items-center justify-start text-gray-500 h-full text-sm font-semibold hover:text-gray-800 fill-gray-500  hover:fill-gray-800 transition delay-50 gap-x-4 pl-4"
        >
          <FaEuroSign className="size-4" />
          <span>Manage salary</span>
        </button>
      </motion.div>
    </>
  );
}

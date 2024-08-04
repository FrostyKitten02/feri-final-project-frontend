import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PopoverProps } from "../../../interfaces";
import React from "react";

export default function Popover({ items, triggerIcon, height }: PopoverProps) {
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
      <button onClick={() => setActionPopoverOpen(true)}>{triggerIcon}</button>
      {actionPopoverOpen && (
        <motion.div
          animate={{ opacity: 1, y: -10 }}
          initial={{ opacity: 0 }}
          exit={{
            opacity: 0,
          }}
          className={`flex flex-col absolute bg-white bottom-full w-64 h-${height} rounded-xl border border-solid border-gray-200 divide-y overflow-hidden`}
          ref={popoverRef}
        >
          <div className="px-3 py-1 font-medium text-black">Actions</div>
          {items.map((item, index) =>
            React.cloneElement(item.component, {
              key: index,
              setActionPopoverOpen,
              onButtonClick: handlePopoverButtonClick,
              onModalClose: handleModalClose,
            })
          )}
        </motion.div>
      )}
    </>
  );
}

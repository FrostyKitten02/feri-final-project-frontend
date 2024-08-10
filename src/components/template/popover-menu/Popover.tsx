import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PopoverProps } from "../../../interfaces";
import React from "react";

export default function Popover({
  items,
  triggerIcon,
  height,
  width,
  position = "bottom",
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ignoreClickOutside = useRef<boolean>(false);
  const [actionPopoverOpen, setActionPopoverOpen] = useState<boolean>(false);
  const [actualPosition, setActualPosition] = useState<string>(position);

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

  useEffect(() => {
    if (actionPopoverOpen && popoverRef.current && triggerRef.current) {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const spaceBelow = windowHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (
        position === "bottom" &&
        spaceBelow < popoverRect.height &&
        spaceAbove > spaceBelow
      ) {
        setActualPosition("top");
      } else if (
        position === "top" &&
        spaceAbove < popoverRect.height &&
        spaceBelow > spaceAbove
      ) {
        setActualPosition("bottom");
      } else {
        setActualPosition(position);
      }
    }
  }, [actionPopoverOpen, position]);

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
          className={`flex z-20 flex-col absolute bg-white ${
            actualPosition == `bottom` ? `top-full` : `bottom-full`
          } mt-4 ${
            width ? `w-${width}` : `w-64`
          } h-${height} rounded-xl border border-solid border-gray-200 divide-y overflow-hidden`}
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

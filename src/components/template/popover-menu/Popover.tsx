import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PopoverItem, PopoverProps } from "../../../interfaces";
import React from "react";

export default function Popover({
  items,
  triggerIcon,
  height,
  width,
  position,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const ignoreClickOutside = useRef<boolean>(false);
  const [actionPopoverOpen, setActionPopoverOpen] = useState<boolean>(false);
  const [activemModalIndex, setActiveModalIndex] = useState<number | null>(
    null
  );

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

  const handleItemClick = (index: number): void => {
    setActiveModalIndex(index);
    setActionPopoverOpen(false);
  };

  const handleModalClose = (): void => {
    setActiveModalIndex(null);
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
            position == `bottom`
              ? `top-full`
              : position === `top-right`
              ? `left-full bottom-full`
              : `bottom-full`
          } mt-4 ${
            width ? `w-${width}` : `w-64`
          } h-${height} rounded-xl border border-solid border-gray-200 divide-y overflow-hidden`}
          ref={popoverRef}
        >
          <div className="px-3 py-1 font-medium text-black">Actions</div>
          {items.map((item: PopoverItem, index: number) => (
            <button
              key={index}
              onClick={() => handleItemClick(index)}
              className="flex flex-row items-center justify-start text-gray-500 h-full text-sm font-semibold hover:text-gray-800 fill-gray-500  hover:fill-gray-800 transition delay-50 gap-x-4 pl-4 hover:bg-gray-100"
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </motion.div>
      )}
      {activemModalIndex !== null &&
        React.cloneElement(items[activemModalIndex].component, {
          onClose: handleModalClose,
          isOpen: true,
        })}
    </>
  );
}

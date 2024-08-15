import { motion } from "framer-motion";
import { BackdropProps } from "../../../interfaces";
import { useEffect, useRef } from "react";
export default function Backdrop({ children, closeModal }: BackdropProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscapePress(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [modalRef]);

  return (
    <motion.div
      ref={modalRef}
      onClick={closeModal}
      className="flex z-50 justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

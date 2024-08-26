import { AnimatePresence, motion } from "framer-motion";
import { BackdropProps } from "../../../interfaces";
import { useEffect, useRef, useState } from "react";
export default function Backdrop({ children, closeModal }: BackdropProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleEscapePress(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [modalRef]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeModal();
    }, 250);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="modalBackdrop"
          ref={modalRef}
          onClick={handleClose}
          className="flex z-50 justify-center items-center fixed top-0 left-0 w-screen overflow-y-auto h-screen bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            exit: { duration: 0.2 },
          }}
        >
          <motion.div
            key="modalContainer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              exit: { duration: 0.2, type: "tween" },
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.25,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

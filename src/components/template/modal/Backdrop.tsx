import { motion } from "framer-motion";
import {BackdropProps} from "../../../interfaces";
export default function Backdrop({ children, closeModal }: BackdropProps) {
  return (
    <motion.div
      onClick={closeModal}
      className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

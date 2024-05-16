import { motion } from "framer-motion";

interface BackdropProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function Backdrop({ children, onClick }: BackdropProps) {
  return (
    <motion.div
      onClick={onClick}
      className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

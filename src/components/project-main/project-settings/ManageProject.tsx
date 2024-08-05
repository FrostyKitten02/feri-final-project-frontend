import { motion } from "framer-motion";
import { FaCog } from "react-icons/fa";
import { ManageProjectModalProps, PopoverItem } from "../../../interfaces";
import { useParams } from "react-router-dom";
import { ProjectModal } from "../../app-main/projects/ProjectModal";
import Popover from "../../template/popover-menu/Popover";
import { DeleteProjectModal } from "../../app-main/projects/DeleteProjectModal";

export default function ManageProjectModal({
  sidebarOpened,
}: ManageProjectModalProps) {
  const { projectId } = useParams();

  const popoverItems: PopoverItem[] = [
    {
      component: (
        <ProjectModal
          projectId={projectId}
          edit={true}
          popoverEdit={true}
        />
      ),
    },
    {
      component: <DeleteProjectModal />
    }
  ];

  return (
    <div
      className={`flex items-center ${
        sidebarOpened && `justify-center`
      } relative z-10`}
    >
      <Popover
        height={28}
        items={popoverItems}
        triggerIcon={
          <span className="flex flex-row justify-center items-center gap-x-3">
            <FaCog className="fill-white size-7" />
            {sidebarOpened && (
              <motion.span
                initial={{ visibility: "hidden", opacity: 0 }}
                animate={{ visibility: "visible", opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-semibold text-xl"
              >
                MANAGE PROJECT
              </motion.span>
            )}
          </span>
        }
      />
    </div>
  );
}

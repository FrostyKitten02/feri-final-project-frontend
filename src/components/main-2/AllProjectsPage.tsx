import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";

function AllProjects() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>("my-projects");

  useEffect(() => {
    navigate("my-projects");
  }, []);

  const goToMyProjects = () => {
    navigate("my-projects");
    setSelectedTab("my-projects");
  };

  const goToAssignedTo = () => {
    navigate("assigned-to");
    setSelectedTab("assigned-to");
  };

  return (
    <div className="flex flex-col h-screen px-20 py-20">
      <div className="flex flex-col">
        <h1 className="flex justify-start items-center font-bold text-3xl">
          All Projects
        </h1>
        <div className="flex flex-row py-12 space-x-6">
          <motion.button
            onClick={goToMyProjects}
            className={`flex items-center justfiy-center text-lg font-semibold rounded-lg px-6 py-2 ${
              selectedTab === "my-projects"
                ? "bg-rose-100 text-rose-500"
                : "text-gray-700"
            }`}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            My projects
          </motion.button>
          <motion.button
            onClick={goToAssignedTo}
            className={`flex items-center justfiy-center text-lg font-semibold rounded-lg px-6 py-2 ${
              selectedTab === "assigned-to"
                ? "bg-rose-100 text-rose-500"
                : "text-gray-700"
            }`}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            Assigned to
          </motion.button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default AllProjects;

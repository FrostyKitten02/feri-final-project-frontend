import { useState } from "react";
import { useSession } from "@clerk/clerk-react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";

interface AddNewProjectPageProps {
  handleClose: () => void;
}

export default function AddNewProjectPage({
  handleClose,
}: AddNewProjectPageProps) {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const session = useSession();

  const [cookies] = useCookies(["__session"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/project",
        {
          title,
          startDate,
          endDate,
          ownerId: session.session?.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.__session}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  //framer motion
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      }
    },
    exit: {
      y: "100vh",
      opacity: 0,
    }
  } 

  return (
    <Backdrop onClick={handleClose}>
      <motion.div className="w-1/2" onClick={(e) => e.stopPropagation()} variants={dropIn} initial="hidden" animate="visible" exit="exit">
        <div className="flex flex-col bg-white rounded-2xl border-solid border-2 border-gray-200">
          <h1 className="text-black px-16 pt-20 pb-5 font-semibold text-xl">
            Add new project
          </h1>
          <div className="px-16 pb-20">
            <form action="post" className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-gray-700 font-bold text-lg">Title</label>
                <input
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-row w-1/2 space-x-8">
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 font-bold text-lg">
                    Start date
                  </label>
                  <input
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    type="date"
                    name="startdate"
                    id="startdate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 font-bold text-lg">
                    End date
                  </label>
                  <input
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    type="date"
                    name="enddate"
                    id="enddate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                  type="submit"
                >
                  Add project
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
}

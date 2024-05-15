import { motion } from "framer-motion";
import Backdrop from "../../allprojects/modal/Backdrop";
import { useEffect, useState } from "react";

import CloseIcon from "../../../assets/add-new-project/close-bold-svgrepo-com.svg?react";

const employeelist = [
  "John Doe",

]

export default function TeamPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <div className="flex w-screen h-full">
      <div className="flex flex-col h-full px-20 py-20 w-full">
        <div className="flex flex-row py-6">
          <div className="flex justify-start w-2/3 items-center">
            <h1 className="font-bold text-3xl">Manage team</h1>
          </div>
          <div className="flex w-1/3 justify-end items-center">
            <button onClick={() => setIsFormOpen(true)}>
              <div className="flex justify-center items-center bg-rose-500 text-white rounded-lg h-12 space-x-4 w-52">
                <p className="font-semibold text-2xl">+</p>
                <p className="font-semibold text-lg">Assign person</p>
              </div>
            </button>
          </div>
        </div>
        <motion.div
          className="flex justify-end"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isFormOpen ? "auto" : 0,
            opacity: isFormOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut", delay: 0.2, type: "tween"}}
        >
          <div className="flex-row pb-6 w-1/2 border-2 border-solid rounded-lg border-gray-200 px-6 py-6">
            <form>
              <div className="flex justify-end">
                <CloseIcon
                  onClick={() => setIsFormOpen(false)}
                  className="size-6 cursor-pointer fill-gray-500 hover:fill-gray-700"
                />
              </div>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold text-lg">
                    Select employee
                  </label>
                  <input
                    className="w-2/3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <button
                    className="px-4 py-2 bg-rose-500 text-white rounded-md"
                    type="submit"
                  >
                    Assign to project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
        <div className="flex flex-col py-12 px-12 border-2 border-solid rounded-2xl border-gray-200 w-full h-full mt-6">
          
        </div>
      </div>
    </div>
  );
}

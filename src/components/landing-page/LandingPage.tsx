import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import Paths from "../../util/Paths";
import steerLogoPath from "../../assets/images/steer_logo_black.png";
import dashboardPath from "../../assets/images/steer_landing_page_dashboard.png";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen min-h-screen w-screen bg-white">
      <SignedOut>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row w-full h-[80px] items-center px-12 pt-4 justify-between bg-white">
            <div className="flex flex-row w-full">
              <img
                src={steerLogoPath}
                className="max-w-full h-20"
                alt="steer logo"
              />
            </div>
            <div className="flex flex-row w-full justify-end items-center">
              <button
                onClick={() => navigate(Paths.SIGN_IN)}
                className="hover:text-primary transition delay-50"
              >
                <span className="text-md font-semibold">Sign in</span>
              </button>
            </div>
          </div>
          <div className="flex w-full h-full py-4 px-4">
            <div className="flex flex-row w-full h-full bg-gradient-to-tr from-white to-c-sky rounded-2xl">
              <div className="flex flex-col w-1/2 items-start justify-center px-20 gap-y-12 h-full">
                <motion.div
                  className="flex flex-col gap-y-12"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <h1 className="font-extrabold text-6xl max-[1499px]:text-3xl">
                    Steer Your Projects to Success.
                  </h1>
                  <h1 className="font-extrabold text-6xl max-[1499px]:text-3xl">
                    Simplify Management, Amplify Productivity.
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <p className="text-xl text-gray-600 font-normal max-[1499px]:text-sm">
                    Steer streamlines project management by letting you create
                    projects, set budgets, assign tasks, and manage team
                    workloads. Track progress and stay on budget.
                  </p>
                </motion.div>
                <motion.div
                  className="pt-6"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <button
                    onClick={() => navigate(Paths.SIGN_IN)}
                    className="w-[200px] h-[60px] max-[1499px]:w-[150px] max-[1499px]:h-[40px] bg-primary rounded-xl transition delay-50 flex justify-center items-center"
                  >
                    <span className="text-white font-semibold text-lg max-[1499px]:text-xs">
                      Start Managing Now
                    </span>
                  </button>
                </motion.div>
              </div>
              <div className="flex w-[60%] justify-end items-center">
                <motion.div
                  className="flex bg-white rounded-l-3xl justify-center drop-shadow-2xl"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, type: "spring", damping: 20 }}
                >
                  <img
                    className="rounded-l-3xl"
                    src={dashboardPath}
                    alt="dashboard"
                  ></img>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Navigate to={Paths.HOME} replace={true} />
      </SignedIn>
    </div>
  );
}

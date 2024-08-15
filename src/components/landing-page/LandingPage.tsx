import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import Paths from "../../util/Paths";
import DashboardImage from "../../assets/images/test.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <SignedOut>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row w-full h-[80px] items-center px-12 pt-4 justify-between bg-white">
            <div className="flex flex-row gap-x-8 w-full">
              <div>logo</div>
              <div className="text-3xl font-semibold">STEER</div>
            </div>
            <div className="flex flex-row w-full gap-x-8 justify-end items-center">
              <button onClick={() => navigate(Paths.SIGN_IN)}>
                <span className="text-md font-semibold">Sign in</span>
              </button>
              <button
                onClick={() => navigate(Paths.SIGN_UP)}
                className="border border-solid rounded-xl px-4 py-2 border-black"
              >
                <span className="text-md font-semibold">Get started</span>
              </button>
            </div>
          </div>
          <div className="flex w-full h-full py-4 px-4">
            <div className="flex flex-row w-full h-full bg-gradient-to-tr from-white to-c-sky rounded-2xl">
              <div className="flex flex-col w-1/2 items-start justify-center px-20 gap-y-12 h-full">
                <div className="flex flex-col gap-y-12">
                  <h1 className="font-extrabold text-6xl">
                    Steer Your Projects to Success.
                  </h1>
                  <h1 className="font-extrabold text-6xl">
                    Simplify Accounting, Amplify Productivity.
                  </h1>
                </div>
                <div>
                  <p className="text-xl text-gray-600 font-normal">
                    Steer streamlines project management by letting you create
                    projects, set budgets, assign tasks, and manage team
                    workloads. Track progress and stay on budget with an
                    intuitive dashboard, all in one easy-to-use platform.
                  </p>
                </div>
                <div className="pt-6">
                  <button
                    onClick={() => navigate(Paths.SIGN_UP)}
                    className="py-4 px-6 bg-primary rounded-xl transition delay-50"
                  >
                    <span className="text-white font-semibold">
                      Start Managing Now
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex w-1/2 justify-end h-full items-center">
                <div className="flex flex-col bg-white w-[800px] rounded-l-3xl justify-center drop-shadow-2xl">
                  <img className="rounded-l-3xl" src={DashboardImage}></img>
                  placeholder image
                </div>
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

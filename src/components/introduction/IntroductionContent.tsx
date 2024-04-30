import { Link } from "react-router-dom";
import Paths from "../../util/Paths";
import IntroductionSlider from "./IntroductionSlider";

export default function IntroductionContent() {
  return (
    <div className="flex h-screen items-center px-16">
      <div className="flex flex-col w-2/5 justify-center text-5xl space-y-24 font-bold">
        <h1>Master the Art of Project Management</h1>
        <h1>Where Goals Meet Execution</h1>
        <h1>The Ultimate Project Command Center</h1>
      </div>
      <div className="flex flex-col w-3/5 justify-center space-y-12 bg-[#0E1428]/40 h-full">
        <div className="flex justify-center text-4xl font-semibold text-white">
          <h1>Features</h1>
        </div>
        <IntroductionSlider />
        <div className="flex justify-center">
          <Link to={Paths.SIGN_UP} className="w-1/2">
            <div className="p-4 bg-white text-black flex justify-center rounded-lg font-semibold">
              Start managing now 
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

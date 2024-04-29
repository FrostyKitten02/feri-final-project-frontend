import { Link } from "react-router-dom";
import Paths from "../../util/Paths";

export default function IntroductionHeader() {
  return (
    <div className="flex flex-col sticky top-0 backdrop-blur-lg ">
      <div className="flex flex-row px-10 py-6 items-center">
        <div className="flex-auto">
          <div className="flex flex-row space-x-6 ">
            <div>icon</div>
            <div className="text-xl font-semibold">ProjectManager</div>
          </div>
        </div>
        <Link to={Paths.SIGN_IN} className="w-24">
          <div className="flex justify-center p-2 text-black font-semibold hover:text-gray-800">
            Sign In
          </div>
        </Link>
      </div>
    </div>
  );
}

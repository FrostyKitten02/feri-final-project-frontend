import { Link } from "react-router-dom";
import Paths from "../../util/Paths";

export default function IntroductionHeader() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row px-10 py-6 items-center">
        <div className="flex-auto w-2/5">
          <div className="flex flex-row space-x-6 ">
            <div>icon</div>
            <div className="text-xl font-semibold">ProjectManager</div>
          </div>
        </div>
        <Link to={Paths.SIGN_IN} className="flex w-3/5 justify-end">
          <div className="flex justify-center p-2 text-black font-semibold hover:text-gray-800">
            Sign In
          </div>
        </Link>
      </div>
    </div>
  );
}

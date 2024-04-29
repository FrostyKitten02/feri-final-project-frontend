import { Link } from "react-router-dom";
import Paths from "../../util/Paths";

export default function IntroductionHeader() {
  return (
    <div className="flex flex-row px-10 py-6 items-center sticky top-0">
      <div className="flex-auto w-50">
        <div className="flex flex-row space-x-6 ">
          <div>ikona</div>
          <div className="text-xl font-semibold">ProjectManager</div>
        </div>
      </div>
      <Link to={Paths.SIGN_IN} className="w-24">
        <div className="flex justify-center p-2 bg-white text-black rounded-lg font-semibold">Sign In</div>
      </Link>
    </div>
  );
}

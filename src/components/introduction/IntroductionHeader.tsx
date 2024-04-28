import { Link } from "react-router-dom";
import Paths from "../../util/Paths";

export default function IntroductionHeader() {
  return (
    <div className="flex flex-row px-10 py-6 backdrop-blur-2xl items-center">
      <div className="flex-auto w-50">
        <div className="flex flex-row space-x-6 ">
          <div>ikona</div>
          <div>ProjectManager</div>
        </div>
      </div>
      <Link to={Paths.SIGN_IN} className="w-24">
        <div className="flex justify-center p-2 bg-white text-black rounded-lg">Sign In</div>
      </Link>
    </div>
  );
}

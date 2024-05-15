import {Link} from "react-router-dom";
import Paths from "../util/Paths";

function ErrorPage() {

  return (
    <div className="flex flex-col h-screen justify-center items-start space-y-6 px-32 overflow-auto bg-gradient-to-r from-bg_placeholder1 to-bg_placeholder2">
      <div className="flex justify-center w-24 py-1 bg-gray-300 font-medium text-slate-500 border border-solid border-slate-500 rounded-lg">

      </div>
      <div className="text-5xl font-bold">Oops! Something went wrong.. 😢</div>
      <div className="text-xl">
        The page you are looking for does not exist or is temporarily
        unavailable.
      </div>
      <Link to={Paths.HOME} className="w-40">
        <div className="p-3 bg-black text-white flex justify-center rounded-lg font-semibold">
          Go Back
        </div>
      </Link>
    </div>
  );
}
export default ErrorPage;

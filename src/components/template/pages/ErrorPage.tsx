import {Link} from "react-router-dom";
import Paths from "../../../util/Paths";
import steerLogoPath from "../../../assets/images/steer_logo_black.png";

function ErrorPage() {
    return (
        <div className="px-32 py-5 h-screen bg-gradient-to-tr from-white to-c-sky flex flex-col">
            <Link to={Paths.HOME}>
                <img src={steerLogoPath} alt="Steer" className="h-24"/>
            </Link>
            <div className="space-y-6 h-full flex flex-col justify-center">
                <div className="text-8xl font-bold">
                    404
                </div>
                <div className="text-5xl font-bold">
                    Oops! Page not Found
                </div>
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
        </div>
    );
}

export default ErrorPage;

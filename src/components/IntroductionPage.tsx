import {Link} from "react-router-dom";
import Paths from "../util/Paths";

function IntroductionPage() {
    return (
        <div>
            <Link to={Paths.SIGN_IN}>
                sign in
            </Link>
            <Link to={Paths.SIGN_UP}>
                sign up
            </Link>
        </div>
    )
}

export default IntroductionPage;
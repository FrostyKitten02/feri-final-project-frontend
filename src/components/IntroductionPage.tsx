import {Link, Navigate} from "react-router-dom";
import Paths from "../util/Paths";
import {SignedIn, SignedOut} from "@clerk/clerk-react";

function IntroductionPage() {
    return (
        <div>
            <SignedOut>
            <Link to={Paths.SIGN_IN}>
                sign in
            </Link>
            <Link to={Paths.SIGN_UP}>
                sign up
            </Link>
            </SignedOut>
            <SignedIn>
                <Navigate to={Paths.HOME} replace={true}/>
            </SignedIn>
        </div>
    )
}

export default IntroductionPage;
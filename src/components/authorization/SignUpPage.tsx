import {SignUp} from "@clerk/clerk-react";

function SignUpPage() {
    return(
        <div>
            <SignUp path="/sign-up" signInUrl={import.meta.env.VITE_SIGN_IN_URL}/>
        </div>
    )
}
export default SignUpPage;
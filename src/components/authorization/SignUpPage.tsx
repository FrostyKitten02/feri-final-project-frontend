import {SignUp} from "@clerk/clerk-react";

function SignUpPage() {
    return(
        <>
            sign up
            <SignUp path="/auth/sign-up" signInUrl={import.meta.env.VITE_SIGN_IN_URL}/>
        </>
    )
}
export default SignUpPage;
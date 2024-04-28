import {SignUp} from "@clerk/clerk-react";

function SignUpPage() {
    return(
        <div className="bg-red-50">
            <SignUp path="/sign-up" signInUrl={import.meta.env.VITE_SIGN_IN_URL}/>
        </div>
    )
}
export default SignUpPage;
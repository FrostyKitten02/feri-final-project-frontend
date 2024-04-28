import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
    return(
        <div className="bg-red-50">
            sign in
            <SignIn path="/sign-in" signUpUrl={import.meta.env.VITE_SIGN_UP_URL}/>
        </div>

    )
};

export default SignInPage;
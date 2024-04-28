import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
    return(
        <div>
            sign in
            <SignIn path="/auth/sign-in" signUpUrl={import.meta.env.VITE_SIGN_UP_URL}/>
        </div>

    )
};

export default SignInPage;
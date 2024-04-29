import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-r from-bg_placeholder1 to-bg_placeholder2">
      <SignIn path="/sign-in" signUpUrl={import.meta.env.VITE_SIGN_UP_URL} />
    </div>
  );
}

export default SignInPage;

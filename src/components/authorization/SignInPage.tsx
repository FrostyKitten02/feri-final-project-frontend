import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-auto bg-gradient-to-tr from-c-sky to-white">
      <SignIn signUpUrl={import.meta.env.VITE_SIGN_UP_URL} />
    </div>
  );
}

export default SignInPage;

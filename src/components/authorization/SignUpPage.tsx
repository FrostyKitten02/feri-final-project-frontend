import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-auto bg-gradient-to-tr from-c-sky to-white">
      <SignUp signInUrl={import.meta.env.VITE_SIGN_IN_URL}/>
    </div>
  );
}
export default SignUpPage;

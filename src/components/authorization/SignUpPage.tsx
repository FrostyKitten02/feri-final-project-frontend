import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-auto bg-gradient-to-r from-bg_placeholder1 to-bg_placeholder2">
      <SignUp signInUrl={import.meta.env.VITE_SIGN_IN_URL}/>
    </div>
  );
}
export default SignUpPage;

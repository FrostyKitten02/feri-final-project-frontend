import { SignIn } from "@clerk/clerk-react";
import steerLogoPath from "../../assets/images/steer_logo_black.png";

function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen overflow-auto bg-gradient-to-tr from-c-sky to-white">
      <img src={steerLogoPath} className="max-w-full ml-[35px]"/>
      <SignIn signUpUrl={import.meta.env.VITE_SIGN_UP_URL} />
    </div>
  );
}

export default SignInPage;

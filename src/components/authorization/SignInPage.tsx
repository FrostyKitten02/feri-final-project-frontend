import { SignIn } from "@clerk/clerk-react";
import steerLogoPath from "../../assets/images/steer_logo_black.png";
import { useEffect } from "react";
import { injectCustomIcon } from "../template/sign-in-icon/CustomIcon";

function SignInPage() {
  useEffect(() => {
    injectCustomIcon();
  });

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen overflow-auto bg-gradient-to-tr from-c-sky to-white">
      <img src={steerLogoPath} className="max-w-56 ml-[35px]" />
      <SignIn signUpUrl={import.meta.env.VITE_SIGN_UP_URL} />
    </div>
  );
}

export default SignInPage;

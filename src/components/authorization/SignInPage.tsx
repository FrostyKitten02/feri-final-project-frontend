import {SignIn} from "@clerk/clerk-react";
import steerLogoPath from "../../assets/images/steer_logo_black.png";
import {useEffect} from "react";
import {injectCustomIcon} from "../template/sign-in-icon/CustomIcon";
import {motion} from "framer-motion";

export const SignInPage = () => {
    useEffect(() => {
        injectCustomIcon();
    }, []);

    return (
        <div
            className="flex flex-col justify-center items-center w-screen h-screen overflow-auto bg-gradient-to-tr from-c-sky to-white">
            <motion.img
                src={steerLogoPath}
                className="max-w-56 ml-[35px]"
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, height: 0}}
                transition={{duration: 1, type: "spring", damping: 20}}
            />
            <SignIn signUpUrl={import.meta.env.VITE_SIGN_UP_URL}/>
        </div>
    );
}
